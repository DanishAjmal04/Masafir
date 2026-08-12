from rest_framework import generics, status, permissions, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product, ProductImage, ProductVariant
from .serializers import (
    CategorySerializer,
    ProductListSerializer,
    ProductDetailSerializer,
    ProductCreateUpdateSerializer,
    ProductImageSerializer,
    ProductVariantSerializer,
)
from .filters import ProductFilter


# ─── Category Views ───────────────────────────────────────────

class CategoryListView(generics.ListAPIView):
    queryset           = Category.objects.filter(is_active=True)
    serializer_class   = CategorySerializer
    permission_classes = [permissions.AllowAny]


# ─── Product Views ────────────────────────────────────────────

class ProductListView(generics.ListAPIView):
    """
    GET /api/products/
    ?gender=men&category=shirts&min_price=1000&max_price=8000
    ?search=linen&tag=New&ordering=price
    """
    serializer_class   = ProductListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends    = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class    = ProductFilter
    ordering_fields    = ["price", "created_at"]
    ordering           = ["-created_at"]

    def get_queryset(self):
        return Product.objects.filter(is_active=True).select_related("category").prefetch_related("images", "reviews")


class ProductDetailView(generics.RetrieveAPIView):
    """GET /api/products/<slug>/"""
    serializer_class   = ProductDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field       = "slug"

    def get_queryset(self):
        return Product.objects.filter(is_active=True).select_related("category").prefetch_related("images", "variants", "reviews")


class FeaturedProductsView(generics.ListAPIView):
    """GET /api/products/featured/ — Homepage ke liye"""
    serializer_class   = ProductListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Product.objects.filter(is_active=True, is_featured=True).prefetch_related("images")[:8]


class NewArrivalsView(generics.ListAPIView):
    """GET /api/products/new-arrivals/"""
    serializer_class   = ProductListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Product.objects.filter(is_active=True, tag="New").prefetch_related("images")[:8]


# ─── Admin Only Views ─────────────────────────────────────────

class ProductCreateView(generics.CreateAPIView):
    serializer_class   = ProductCreateUpdateSerializer
    permission_classes = [permissions.IsAdminUser]


class ProductUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class   = ProductCreateUpdateSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field       = "slug"
    queryset           = Product.objects.all()


# ─── Product Images ───────────────────────────────────────────

class ProductImageUploadView(APIView):
    permission_classes = [permissions.IsAdminUser]
    parser_classes     = [MultiPartParser, FormParser]

    def post(self, request, product_id):
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(product=product)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, product_id, image_id):
        try:
            image = ProductImage.objects.get(id=image_id, product_id=product_id)
            image.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ProductImage.DoesNotExist:
            return Response({"detail": "Image not found."}, status=status.HTTP_404_NOT_FOUND)


# ─── Product Variants ─────────────────────────────────────────

class ProductVariantView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, product_id):
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductVariantSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(product=product)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, product_id, variant_id):
        try:
            variant = ProductVariant.objects.get(id=variant_id, product_id=product_id)
        except ProductVariant.DoesNotExist:
            return Response({"detail": "Variant not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductVariantSerializer(variant, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, product_id, variant_id):
        try:
            variant = ProductVariant.objects.get(id=variant_id, product_id=product_id)
            variant.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ProductVariant.DoesNotExist:
            return Response({"detail": "Variant not found."}, status=status.HTTP_404_NOT_FOUND)