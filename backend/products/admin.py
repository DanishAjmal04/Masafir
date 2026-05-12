from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Category, Product, ProductImage, ProductVariant


class ProductImageInline(admin.TabularInline):
    model  = ProductImage
    extra  = 1
    fields = ["image", "alt_text", "is_primary", "order"]


class ProductVariantInline(admin.TabularInline):
    model  = ProductVariant
    extra  = 6
    fields = ["size", "color", "stock", "sku"]
    readonly_fields = ["sku"]


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display  = ["name", "gender", "is_active", "created_at"]
    list_filter   = ["gender", "is_active"]
    search_fields = ["name"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display   = ["name", "category", "gender", "price", "tag", "is_active", "is_featured", "created_at"]
    list_filter    = ["gender", "is_active", "is_featured", "tag", "category"]
    search_fields  = ["name", "description"]
    list_editable  = ["price", "is_active", "is_featured"]
    prepopulated_fields = {"slug": ("name",)}
    inlines        = [ProductImageInline, ProductVariantInline]
    readonly_fields = ["created_at", "updated_at"]

    fieldsets = (
        ("Basic Info",  {"fields": ("name", "slug", "category", "gender", "tag")}),
        ("Details",     {"fields": ("description", "price")}),
        ("Visibility",  {"fields": ("is_active", "is_featured")}),
        ("Timestamps",  {"fields": ("created_at", "updated_at")}),
    )


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display  = ["product", "size", "color", "stock", "in_stock"]
    list_filter   = ["size", "color"]
    search_fields = ["product__name", "sku"]
    list_editable = ["stock"]