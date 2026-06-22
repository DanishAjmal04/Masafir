from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    user_name  = serializers.SerializerMethodField()
    user_email = serializers.SerializerMethodField()

    class Meta:
        model  = Review
        fields = ["id", "rating", "body", "user_name", "user_email", "created_at"]
        read_only_fields = ["id", "created_at"]

    def get_user_name(self, obj):
        if obj.user:
            return obj.user.full_name
        return obj.guest_name or "Anonymous"

    def get_user_email(self, obj):
        if obj.user:
            return obj.user.email
        return None

    def validate_rating(self, value):
        if not 1 <= value <= 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value


class ReviewCreateSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True, required=False, allow_blank=True, max_length=100)

    class Meta:
        model  = Review
        fields = ["rating", "body", "name"]

    def validate(self, data):
        request = self.context["request"]
        product = self.context["product"]
        user     = request.user if request.user.is_authenticated else None

        if user:
            if Review.objects.filter(user=user, product=product).exists():
                raise serializers.ValidationError("You have already reviewed this product.")
        else:
            name = data.get("name", "").strip()
            if not name:
                raise serializers.ValidationError({"name": "Name is required for guest reviews."})

        return data

    def create(self, validated_data):
        request = self.context["request"]
        product = self.context["product"]
        user    = request.user if request.user.is_authenticated else None
        name    = validated_data.pop("name", "").strip()

        return Review.objects.create(
            user       = user,
            guest_name = None if user else name,
            product    = product,
            **validated_data
        )