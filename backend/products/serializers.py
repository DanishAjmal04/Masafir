from rest_framework import serializers
from .models import Category, Product, ProductImage, ProductVariant


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = Category
        fields = ["id", "name", "slug", "gender", "image", "is_active"]


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ProductImage
        fields = ["id", "image", "alt_text", "is_primary", "order"]


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ProductVariant
        fields = ["id", "size", "color", "stock", "sku", "in_stock"]


class ProductListSerializer(serializers.ModelSerializer):
    """Listing page ke liye — light weight"""
    primary_image = serializers.ReadOnlyField()
    avg_rating    = serializers.ReadOnlyField()
    review_count  = serializers.ReadOnlyField()
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model  = Product
        fields = [
            "id", "name", "slug", "price", "gender", "tag",
            "is_featured", "primary_image", "avg_rating",
            "review_count", "category_name", "created_at",
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    """Product detail page ke liye — full data"""
    images        = ProductImageSerializer(many=True, read_only=True)
    variants      = ProductVariantSerializer(many=True, read_only=True)
    category      = CategorySerializer(read_only=True)
    avg_rating    = serializers.ReadOnlyField()
    review_count  = serializers.ReadOnlyField()

    class Meta:
        model  = Product
        fields = [
            "id", "name", "slug", "description", "price", "gender",
            "tag", "is_featured", "is_active", "category", "images",
            "variants", "avg_rating", "review_count", "created_at",
        ]


class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    """Admin ke liye — create/update"""
    class Meta:
        model  = Product
        fields = [
            "name", "category", "description", "price", "gender",
            "tag", "is_active", "is_featured",
        ]

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than 0.")
        return value