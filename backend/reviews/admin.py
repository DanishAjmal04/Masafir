from django.contrib import admin
from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display  = ["user", "product", "rating", "is_approved", "created_at"]
    list_filter   = ["rating", "is_approved"]
    search_fields = ["user__email", "product__name"]
    list_editable = ["is_approved"]
    readonly_fields = ["created_at", "updated_at"]