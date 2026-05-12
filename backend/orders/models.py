from decimal import Decimal
from django.db import models
from users.models import User
from products.models import Product, ProductVariant


class Order(models.Model):

    STATUS_CHOICES = [
        ("pending",    "Pending"),
        ("confirmed",  "Confirmed"),
        ("processing", "Processing"),
        ("shipped",    "Shipped"),
        ("delivered",  "Delivered"),
        ("cancelled",  "Cancelled"),
        ("refunded",   "Refunded"),
    ]

    PAYMENT_CHOICES = [
        ("cod",           "Cash on Delivery"),
        ("card",          "Credit/Debit Card"),
        ("bank_transfer", "Bank Transfer"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,          # ← guest ke liye blank allow
        related_name="orders"
    )

    # ── Guest fields ───────────────────────────────────────────
    guest_email = models.EmailField(null=True, blank=True)
    guest_name  = models.CharField(max_length=255, null=True, blank=True)

    order_number = models.CharField(max_length=20, unique=True, blank=True)

    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="pending"
    )

    payment_method = models.CharField(
        max_length=20, choices=PAYMENT_CHOICES, default="cod"
    )

    payment_status = models.BooleanField(default=False)

    # Shipping snapshot
    shipping_name     = models.CharField(max_length=100)
    shipping_phone    = models.CharField(max_length=20)
    shipping_address  = models.CharField(max_length=255)
    shipping_city     = models.CharField(max_length=100)
    shipping_province = models.CharField(max_length=100)
    shipping_postal   = models.CharField(max_length=10, blank=True)

    subtotal      = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount      = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total         = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    coupon_code = models.CharField(max_length=50, blank=True)
    notes       = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "orders"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Order #{self.order_number}"

    def save(self, *args, **kwargs):
        if not self.order_number:
            import random, string
            self.order_number = "MSF-" + "".join(random.choices(string.digits, k=8))
        super().save(*args, **kwargs)

    def calculate_totals(self):
        subtotal = Decimal("0.00")
        for item in self.items.all():
            subtotal += item.total_price

        self.subtotal     = subtotal
        self.shipping_cost = Decimal("0.00") if subtotal >= Decimal("5000") else Decimal("350.00")
        self.total        = self.subtotal + self.shipping_cost - self.discount
        self.save()

    @property
    def contact_email(self):
        """Order email — logged in ho ya guest"""
        if self.user:
            return self.user.email
        return self.guest_email or ""


class OrderItem(models.Model):

    order   = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    variant = models.ForeignKey(ProductVariant, on_delete=models.SET_NULL, null=True, blank=True)

    # Snapshot fields
    product_name  = models.CharField(max_length=200)
    product_image = models.CharField(max_length=500, blank=True)
    size          = models.CharField(max_length=10, blank=True)
    color         = models.CharField(max_length=50, blank=True)
    price         = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    quantity      = models.PositiveIntegerField(default=1)

    class Meta:
        db_table = "order_items"

    def __str__(self):
        return f"{self.product_name} x{self.quantity}"

    @property
    def total_price(self):
        return (self.price or Decimal("0.00")) * (self.quantity or 0)


class OrderStatusHistory(models.Model):

    order  = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="history")
    status = models.CharField(max_length=20)
    note   = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table     = "order_status_history"
        ordering     = ["-created_at"]

    def __str__(self):
        return f"Order #{self.order.order_number} → {self.status}"