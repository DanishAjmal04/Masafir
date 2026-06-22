from django.contrib import admin
from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display  = ["reviewer_display", "product", "rating", "is_approved", "created_at"]
    list_filter   = ["rating", "is_approved"]
    search_fields = ["user__email", "guest_name", "product__name"]
    list_editable = ["is_approved"]
    readonly_fields = ["created_at", "updated_at"]

    def reviewer_display(self, obj):
        return obj.user.email if obj.user else f"{obj.guest_name} (Guest)"
    reviewer_display.short_description = "Reviewer"