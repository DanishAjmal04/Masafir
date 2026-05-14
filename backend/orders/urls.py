from django.urls import path
from .views import (
    PlaceOrderView,
    MyOrdersView,
    OrderDetailView,
    CancelOrderView,
    AllOrdersView,
    UpdateOrderStatusView,
)

urlpatterns = [
    path("place/",                            PlaceOrderView.as_view(),        name="place_order"),
    path("admin/all/",                        AllOrdersView.as_view(),         name="all_orders"),
    path("admin/<str:order_number>/status/",  UpdateOrderStatusView.as_view(), name="update_status"),
    path("<str:order_number>/cancel/",        CancelOrderView.as_view(),       name="cancel_order"),
    path("<str:order_number>/",               OrderDetailView.as_view(),       name="order_detail"),
    path("",                                  MyOrdersView.as_view(),          name="my_orders"),
]