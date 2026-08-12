from django.urls import path
from .views import ProductReviewListView, ReviewCreateView, ReviewUpdateDeleteView

urlpatterns = [
    path("<slug:slug>/",         ProductReviewListView.as_view(), name="review_list"),
    path("<slug:slug>/create/",  ReviewCreateView.as_view(),      name="review_create"),
    path("<int:pk>/manage/",     ReviewUpdateDeleteView.as_view(), name="review_manage"),
]