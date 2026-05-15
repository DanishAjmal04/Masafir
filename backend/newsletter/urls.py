from django.urls import path
from .views import SubscribeView, UnsubscribeView, BroadcastView

urlpatterns = [
    path("subscribe/",   SubscribeView.as_view(),   name="newsletter_subscribe"),
    path("unsubscribe/", UnsubscribeView.as_view(),  name="newsletter_unsubscribe"),
    path("broadcast/",   BroadcastView.as_view(),    name="newsletter_broadcast"),
]