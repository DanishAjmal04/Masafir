from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from .models import NewsletterSubscriber
from .serializers import SubscribeSerializer, BroadcastSerializer


class SubscribeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = SubscribeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"detail": "Successfully subscribed!"},
                status=status.HTTP_201_CREATED
            )
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class UnsubscribeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response(
                {"detail": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            sub = NewsletterSubscriber.objects.get(email=email)
            sub.is_active = False
            sub.save()
            return Response({"detail": "Unsubscribed successfully."})
        except NewsletterSubscriber.DoesNotExist:
            return Response(
                {"detail": "Email not found."},
                status=status.HTTP_404_NOT_FOUND
            )


class BroadcastView(APIView):
    """Admin sirf yeh use kar sakta hai — sab subscribers ko mail bhejo"""
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        serializer = BroadcastSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        subject = serializer.validated_data["subject"]
        message = serializer.validated_data["message"]

        # Sab active subscribers ki emails
        emails = list(
            NewsletterSubscriber.objects.filter(is_active=True)
            .values_list("email", flat=True)
        )

        if not emails:
            return Response(
                {"detail": "No active subscribers found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Full message with unsubscribe note
        full_message = f"""{message}

━━━━━━━━━━━━━━━━━━━━━━━━
Masafir — Wear the Journey
masafir.vercel.app

Unsubscribe karne ke liye reply karein.
        """

        # BCC mein sab emails — privacy ke liye
        send_mail(
            subject        = subject,
            message        = full_message,
            from_email     = settings.DEFAULT_FROM_EMAIL,
            recipient_list = [settings.ADMIN_EMAIL],  # To: admin
            bcc            = emails,                   # BCC: sab subscribers
            fail_silently  = False,
        )

        return Response({
            "detail": f"Email sent to {len(emails)} subscribers.",
            "count":  len(emails),
        })