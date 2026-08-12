from django.contrib import admin
from django.core.mail import send_mail
from django.conf import settings
from django import forms
from .models import NewsletterSubscriber


class BroadcastForm(forms.Form):
    subject = forms.CharField(max_length=200, widget=forms.TextInput(attrs={"style": "width:100%"}))
    message = forms.CharField(widget=forms.Textarea(attrs={"rows": 10, "style": "width:100%"}))


@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display   = ["email", "is_active", "created_at"]
    list_filter    = ["is_active"]
    search_fields  = ["email"]
    list_editable  = ["is_active"]
    readonly_fields = ["created_at"]

    actions = ["send_broadcast", "deactivate_selected", "activate_selected"]

    def send_broadcast(self, request, queryset):
        """Selected subscribers ko mail bhejo"""
        emails = list(queryset.filter(is_active=True).values_list("email", flat=True))

        if not emails:
            self.message_user(request, "Koi active subscriber selected nahi.", level="warning")
            return

        subject = request.POST.get("subject", "Update from Masafir")
        message = request.POST.get("message", "")

        if not message:
            self.message_user(
                request,
                "Broadcast ke liye subject aur message API se bhejein: POST /api/newsletter/broadcast/",
                level="warning"
            )
            return

        send_mail(
            subject        = subject,
            message        = message,
            from_email     = settings.DEFAULT_FROM_EMAIL,
            recipient_list = [settings.ADMIN_EMAIL],
            bcc            = emails,
            fail_silently  = False,
        )
        self.message_user(request, f"Email {len(emails)} subscribers ko bhej di.")

    send_broadcast.short_description    = "📧 Selected ko email bhejo"

    def deactivate_selected(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(request, "Selected subscribers deactivate ho gaye.")
    deactivate_selected.short_description = "❌ Deactivate"

    def activate_selected(self, request, queryset):
        queryset.update(is_active=True)
        self.message_user(request, "Selected subscribers activate ho gaye.")
    activate_selected.short_description = "✅ Activate"