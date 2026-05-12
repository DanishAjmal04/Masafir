from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/",        admin.site.urls),
    path("api/users/",    include("users.urls")),
    path("api/products/", include("products.urls")),
    path("api/orders/",   include("orders.urls")),
    path("api/reviews/",  include("reviews.urls")),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/auth/social/', include('allauth.socialaccount.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)