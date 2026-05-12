from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, LoginView, LogoutView,
    ProfileView, ChangePasswordView,
    AddressListCreateView, AddressDetailView, SetDefaultAddressView,GoogleLoginView
)

urlpatterns = [
    # Auth
    path("register/",         RegisterView.as_view(),        name="register"),
    path("login/",            LoginView.as_view(),           name="login"),
    path("logout/",           LogoutView.as_view(),          name="logout"),
    path("token/refresh/",    TokenRefreshView.as_view(),    name="token_refresh"),
   path("google/", GoogleLoginView.as_view()),
    # Profile
    path("profile/",          ProfileView.as_view(),         name="profile"),
    path("change-password/",  ChangePasswordView.as_view(),  name="change_password"),
    # Addresses
    path("addresses/",                    AddressListCreateView.as_view(), name="address_list"),
    path("addresses/<int:pk>/",           AddressDetailView.as_view(),     name="address_detail"),
    path("addresses/<int:pk>/set-default/", SetDefaultAddressView.as_view(), name="address_set_default"),
]