from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Address


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display   = ["email", "first_name", "last_name", "is_staff", "created_at"]
    list_filter    = ["is_staff", "is_active"]
    search_fields  = ["email", "first_name", "last_name"]
    ordering       = ["-created_at"]
    fieldsets = (
        (None,           {"fields": ("email", "password")}),
        ("Personal Info",{"fields": ("first_name", "last_name", "phone")}),
        ("Permissions",  {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Dates",        {"fields": ("last_login", "created_at")}),
    )
    add_fieldsets = (
        (None, {"classes": ("wide",), "fields": ("email", "password1", "password2")}),
    )
    readonly_fields = ["created_at", "last_login"]


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display  = ["full_name", "city", "province", "is_default", "user"]
    list_filter   = ["city", "province", "is_default"]
    search_fields = ["full_name", "city", "user__email"]