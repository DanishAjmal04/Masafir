from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    user_name  = serializers.CharField(source="user.full_name", read_only=True)
    user_email = serializers.CharField(source="user.email",     read_only=True)

    class Meta:
        model  = Review
        fields = ["id", "rating", "body", "user_name", "user_email", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_rating(self, value):
        if not 1 <= value <= 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value


class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Review
        fields = ["rating", "body"]

    def validate(self, data):
        user    = self.context["request"].user
        product = self.context["product"]
        if Review.objects.filter(user=user, product=product).exists():
            raise serializers.ValidationError("You have already reviewed this product.")
        return data

    def create(self, validated_data):
        return Review.objects.create(
            user    = self.context["request"].user,
            product = self.context["product"],
            **validated_data
        )