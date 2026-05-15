from rest_framework import serializers
from .models import NewsletterSubscriber


class SubscribeSerializer(serializers.ModelSerializer):
    class Meta:
        model  = NewsletterSubscriber
        fields = ["email"]

    def validate_email(self, value):
        # Already subscribed check
        if NewsletterSubscriber.objects.filter(
            email=value, is_active=True
        ).exists():
            raise serializers.ValidationError(
                "This email is already subscribed."
            )
        return value

    def create(self, validated_data):
        # Agar pehle unsubscribe kiya tha toh reactivate karo
        obj, created = NewsletterSubscriber.objects.get_or_create(
            email=validated_data["email"]
        )
        if not created:
            obj.is_active = True
            obj.save()
        return obj


class BroadcastSerializer(serializers.Serializer):
    subject = serializers.CharField(max_length=200)
    message = serializers.CharField()