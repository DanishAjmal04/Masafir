from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from products.models import Product
from .models import Review
from .serializers import ReviewSerializer, ReviewCreateSerializer


class ProductReviewListView(generics.ListAPIView):
    """GET /api/reviews/<product_slug>/ — sab reviews public"""
    serializer_class   = ReviewSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        slug = self.kwargs["slug"]
        return Review.objects.filter(
            product__slug=slug,
            is_approved=True
        ).select_related("user")


class ReviewCreateView(APIView):
    """POST /api/reviews/<product_slug>/create/ — login required nahi, guest bhi review de sakte hain"""
    permission_classes = [permissions.AllowAny]

    def post(self, request, slug):
        try:
            product = Product.objects.get(slug=slug, is_active=True)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ReviewCreateSerializer(
            data    = request.data,
            context = {"request": request, "product": product}
        )
        if serializer.is_valid():
            review = serializer.save()
            return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReviewUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    """PUT/DELETE /api/reviews/<id>/  — sirf apni review (login required)"""
    serializer_class   = ReviewCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({"detail": "Review deleted."}, status=status.HTTP_204_NO_CONTENT)