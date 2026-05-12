from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from users.models import User
from products.models import Product


class Review(models.Model):
    product    = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="reviews")
    user       = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews")
    rating     = models.PositiveSmallIntegerField(
                    validators=[MinValueValidator(1), MaxValueValidator(5)]
                 )
    body       = models.TextField()
    is_approved = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table        = "reviews"
        ordering        = ["-created_at"]
        unique_together = ["product", "user"]  # ek user ek product pe ek hi review

    def __str__(self):
        return f"{self.user.email} — {self.product.name} ({self.rating}★)"