import django_filters
from .models import Product


class ProductFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr="lte")
    gender    = django_filters.CharFilter(field_name="gender", lookup_expr="iexact")
    category  = django_filters.CharFilter(field_name="category__slug", lookup_expr="iexact")
    tag       = django_filters.CharFilter(field_name="tag", lookup_expr="iexact")
    search    = django_filters.CharFilter(field_name="name", lookup_expr="icontains")

    class Meta:
        model  = Product
        fields = ["gender", "category", "tag", "min_price", "max_price", "search"]