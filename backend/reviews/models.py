from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from users.models import User
from products.models import Product


class Review(models.Model):
    product     = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="reviews")
    user        = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews", null=True, blank=True)
    guest_name  = models.CharField(max_length=100, null=True, blank=True)
    rating      = models.PositiveSmallIntegerField(
                    validators=[MinValueValidator(1), MaxValueValidator(5)]
                  )
    body        = models.TextField()
    is_approved = models.BooleanField(default=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "reviews"
        ordering = ["-created_at"]
        # Note: unique_together hata diya hai kyun ke guest (user=None) ke
        # case mein yeh constraint kaam nahi karega aur multiple guests
        # ko block kar dega. Duplicate-prevention ab serializer mein
        # sirf logged-in users ke liye manually check hoti hai.

    def __str__(self):
        reviewer = self.user.email if self.user else (self.guest_name or "Guest")
        return f"{reviewer} — {self.product.name} ({self.rating}★)"