from django.contrib import admin
from django.utils.html import format_html

from .models import Order, OrderItem, OrderStatusHistory

# from .emails import (
#     send_user_order_confirmed_email,
#     send_admin_new_order_email
# )

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    can_delete = False

    readonly_fields = [
        "product_name",
        "product_image",
        "size",
        "color",
        "price",
        "quantity",
        "total_price",
    ]


class OrderStatusHistoryInline(admin.TabularInline):
    model = OrderStatusHistory
    extra = 1
    readonly_fields = ["created_at"]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):

    list_display = [
        "order_number",
        "shipping_name",
        "status",
        "payment_method",
        "payment_status",
        "total",
        "created_at",
        "confirm_button",
    ]

    list_filter = [
        "status",
        "payment_method",
        "payment_status",
    ]

    search_fields = [
        "order_number",
        "user__email",
        "shipping_name",
    ]

    readonly_fields = [
        "order_number",
        "subtotal",
        "shipping_cost",
        "total",
        "created_at",
        "updated_at",
        "payment_screenshot_preview",
    ]

    inlines = [OrderItemInline, OrderStatusHistoryInline]

    fieldsets = (
        (
            "Order Info",
            {
                "fields": (
                    "order_number",
                    "user",
                    "status",
                    "notes",
                )
            },
        ),

        (
            "Payment",
            {
                "fields": (
                    "payment_method",
                    "payment_status",
                    # "payment_reference", ❌ removed
                    "payment_screenshot_preview",
                    "coupon_code",
                )
            },
        ),

        (
            "Shipping",
            {
                "fields": (
                    "shipping_name",
                    "shipping_phone",
                    "shipping_address",
                    "shipping_city",
                    "shipping_province",
                    "shipping_postal",
                )
            },
        ),

        (
            "Totals",
            {
                "fields": (
                    "subtotal",
                    "shipping_cost",
                    "discount",
                    "total",
                )
            },
        ),

        (
            "Timestamps",
            {
                "fields": (
                    "created_at",
                    "updated_at",
                )
            },
        ),
    )

    actions = ["confirm_orders", "cancel_orders"]

    def confirm_button(self, obj):
        if obj.status in ["pending", "processing"]:
            return format_html(
                '<a href="/admin/orders/confirm/{}/" '
                'style="background:#0F0F0E;color:white;padding:5px 12px;'
                'text-decoration:none;font-size:11px;border-radius:3px;">'
                '✅ Confirm Order</a>',
                obj.order_number
            )
    
        elif obj.status == "confirmed":
            return "✅ Confirmed"
    
        return obj.status.title()

    confirm_button.short_description = "Action"

    def confirm_orders(self, request, queryset):

        confirmed_count = 0

        for order in queryset:

            if order.status != "confirmed":

                order.status = "confirmed"
                order.payment_status = True
                order.save()

                OrderStatusHistory.objects.create(
                    order=order,
                    status="confirmed",
                    note="Confirmed by admin."
                )

                # User email
                if order.user and order.user.email:
                    send_user_order_confirmed_email(order)

                confirmed_count += 1

        self.message_user(
            request,
            f"{confirmed_count} orders confirm ho gaye."
        )

    confirm_orders.short_description = "✅ Confirm orders aur email bhejo"

    def cancel_orders(self, request, queryset):

        queryset.update(status="cancelled")

        self.message_user(
            request,
            "Selected orders cancel ho gaye."
        )

    cancel_orders.short_description = "❌ Cancel orders"

    def payment_screenshot_preview(self, obj):

        if obj.payment_screenshot:

            return format_html(
                '''
                <img src="{}"
                     style="
                        max-width:500px;
                        max-height:500px;
                        border:1px solid #ddd;
                     " />
                ''',
                obj.payment_screenshot.url
            )

        return "Screenshot upload nahi hua"

    payment_screenshot_preview.short_description = "Payment Screenshot"


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):

    list_display = [
        "product_name",
        "order",
        "size",
        "color",
        "price",
        "quantity",
    ]

    search_fields = [
        "product_name",
        "order__order_number",
    ]

    readonly_fields = ["total_price"]