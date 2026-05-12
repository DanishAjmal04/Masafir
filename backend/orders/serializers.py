from rest_framework import serializers
from .models import Order, OrderItem, OrderStatusHistory
from products.models import Product


class OrderItemSerializer(serializers.ModelSerializer):
    total_price = serializers.ReadOnlyField()

    class Meta:
        model  = OrderItem
        fields = [
            "id", "product", "product_name", "product_image",
            "size", "color", "price", "quantity", "total_price"
        ]
        read_only_fields = ["id"]


class OrderStatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = OrderStatusHistory
        fields = ["status", "note", "created_at"]


class OrderListSerializer(serializers.ModelSerializer):
    item_count = serializers.SerializerMethodField()

    class Meta:
        model  = Order
        fields = [
            "id", "order_number", "status", "payment_method",
            "payment_status", "total", "item_count", "created_at"
        ]

    def get_item_count(self, obj):
        return obj.items.count()


class OrderDetailSerializer(serializers.ModelSerializer):
    items   = OrderItemSerializer(many=True, read_only=True)
    history = OrderStatusHistorySerializer(many=True, read_only=True)

    class Meta:
        model  = Order
        fields = [
            "id", "order_number", "status", "payment_method", "payment_status",
            "guest_email", "guest_name",
            "shipping_name", "shipping_phone", "shipping_address",
            "shipping_city", "shipping_province", "shipping_postal",
            "subtotal", "shipping_cost", "discount", "total",
            "coupon_code", "notes", "items", "history", "created_at",
        ]


class PlaceOrderSerializer(serializers.Serializer):
    # Shipping info
    shipping_name     = serializers.CharField(max_length=100)
    shipping_phone    = serializers.CharField(max_length=20)
    shipping_address  = serializers.CharField(max_length=255)
    shipping_city     = serializers.CharField(max_length=100)
    shipping_province = serializers.CharField(max_length=100)
    shipping_postal   = serializers.CharField(max_length=10, required=False, allow_blank=True)

    # Guest fields — logged in nahi hai tou yeh zaroori
    guest_email = serializers.EmailField(required=False, allow_blank=True)
    guest_name  = serializers.CharField(max_length=255, required=False, allow_blank=True)

    # Payment
    payment_method = serializers.ChoiceField(choices=["cod", "card", "bank_transfer"])

    # Optional
    coupon_code = serializers.CharField(max_length=50, required=False, allow_blank=True)
    notes       = serializers.CharField(required=False, allow_blank=True)

    # Cart items
    items = serializers.ListField(child=serializers.DictField(), min_length=1)

    def validate(self, data):
        request = self.context.get("request")
        # Guest hai tou email zaroori hai
        if not request.user.is_authenticated:
            if not data.get("guest_email", "").strip():
                raise serializers.ValidationError({
                    "guest_email": "Email is required to place an order."
                })
        return data

    def validate_items(self, items):
        validated = []
        for item in items:
            try:
                product = Product.objects.get(id=item["product_id"], is_active=True)
                validated.append({
                    "product":       product,
                    "quantity":      int(item.get("quantity", 1)),
                    "size":          item.get("size", ""),
                    "color":         item.get("color", ""),
                    "price":         product.price,
                    "product_name":  product.name,
                    "product_image": product.primary_image or "",
                })
            except (Product.DoesNotExist, KeyError):
                raise serializers.ValidationError("Invalid product in cart.")
        return validated

    def create(self, validated_data):
        items_data  = validated_data.pop("items")
        coupon_code = validated_data.pop("coupon_code", "")
        request     = self.context["request"]

        # User — logged in hai ya guest
        user        = request.user if request.user.is_authenticated else None
        guest_email = validated_data.pop("guest_email", "") if not user else ""
        guest_name  = validated_data.pop("guest_name",  "") if not user else ""

        order = Order.objects.create(
            user        = user,
            guest_email = guest_email or None,
            guest_name  = guest_name  or None,
            coupon_code = coupon_code,
            **validated_data
        )

        for item in items_data:
            OrderItem.objects.create(order=order, **item)

        order.calculate_totals()

        OrderStatusHistory.objects.create(
            order  = order,
            status = "pending",
            note   = "Order placed successfully."
        )

        return order


class UpdateOrderStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=[
        "pending", "confirmed", "processing",
        "shipped", "delivered", "cancelled", "refunded"
    ])
    note = serializers.CharField(required=False, allow_blank=True)