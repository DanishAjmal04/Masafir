from django.urls import path
from .views import (
    CategoryListView,
    ProductListView,
    ProductDetailView,
    FeaturedProductsView,
    NewArrivalsView,
    ProductCreateView,
    ProductUpdateDeleteView,
    ProductImageUploadView,
    ProductVariantView,
)

urlpatterns = [
    # Public
    path("",                         ProductListView.as_view(),        name="product_list"),
    path("featured/",                FeaturedProductsView.as_view(),   name="featured_products"),
    path("new-arrivals/",            NewArrivalsView.as_view(),        name="new_arrivals"),
    path("categories/",              CategoryListView.as_view(),       name="category_list"),
    path("<slug:slug>/",             ProductDetailView.as_view(),      name="product_detail"),

    # Admin
    path("create/",                  ProductCreateView.as_view(),      name="product_create"),
    path("<slug:slug>/edit/",        ProductUpdateDeleteView.as_view(), name="product_edit"),

    # Images
    path("<int:product_id>/images/",                     ProductImageUploadView.as_view(), name="product_images"),
    path("<int:product_id>/images/<int:image_id>/",      ProductImageUploadView.as_view(), name="product_image_delete"),

    # Variants
    path("<int:product_id>/variants/",                   ProductVariantView.as_view(), name="product_variants"),
    path("<int:product_id>/variants/<int:variant_id>/",  ProductVariantView.as_view(), name="product_variant_detail"),
]