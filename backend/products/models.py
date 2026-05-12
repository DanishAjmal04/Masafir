from django.db import models
from django.utils.text import slugify
from django.conf import settings


class Category(models.Model):
    GENDER_CHOICES = [
        ("men",   "Men"),
        ("women", "Women"),
        ("unisex","Unisex"),
    ]

    name       = models.CharField(max_length=100)
    slug       = models.SlugField(unique=True, blank=True)
    gender     = models.CharField(max_length=10, choices=GENDER_CHOICES, default="unisex")
    image      = models.ImageField(upload_to="categories/", blank=True, null=True)
    is_active  = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table  = "categories"
        ordering  = ["name"]
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Product(models.Model):
    GENDER_CHOICES = [
        ("men",   "Men"),
        ("women", "Women"),
        ("unisex","Unisex"),
    ]

    category    = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name="products")
    name        = models.CharField(max_length=200)
    slug        = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True)
    price       = models.DecimalField(max_digits=10, decimal_places=2)
    gender      = models.CharField(max_length=10, choices=GENDER_CHOICES, default="unisex")
    is_active   = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    tag         = models.CharField(max_length=50, blank=True)  # "New", "Bestseller", "Sale"
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "products"
        ordering = ["-created_at"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    @property
    def primary_image(self):
        img = self.images.filter(is_primary=True).first()
        if not img:
            img = self.images.first()
        if img:
            return f"{settings.SITE_URL}{img.image.url}"
        return None

    @property
    def avg_rating(self):
        reviews = self.reviews.all()
        if not reviews:
            return 0
        return round(sum(r.rating for r in reviews) / len(reviews), 1)

    @property
    def review_count(self):
        return self.reviews.count()


class ProductImage(models.Model):
    product    = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image      = models.ImageField(upload_to="products/")
    alt_text   = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)
    order      = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "product_images"
        ordering = ["order"]

    def __str__(self):
        return f"{self.product.name} — Image {self.order}"

    def save(self, *args, **kwargs):
        if self.is_primary:
            ProductImage.objects.filter(product=self.product, is_primary=True).update(is_primary=False)
        super().save(*args, **kwargs)


class ProductVariant(models.Model):
    SIZE_CHOICES = [
        ("XS",  "XS"),
        ("S",   "S"),
        ("M",   "M"),
        ("L",   "L"),
        ("XL",  "XL"),
        ("XXL", "XXL"),
    ]

    product  = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="variants")
    size     = models.CharField(max_length=5, choices=SIZE_CHOICES)
    color    = models.CharField(max_length=50, blank=True)
    stock    = models.PositiveIntegerField(default=0)
    sku      = models.CharField(max_length=100, unique=True, blank=True)

    class Meta:
        db_table = "product_variants"
        unique_together = ["product", "size", "color"]

    def __str__(self):
        return f"{self.product.name} — {self.size} / {self.color}"

    @property
    def in_stock(self):
        return self.stock > 0

    def save(self, *args, **kwargs):
        if not self.sku:
            self.sku = f"{self.product.id}-{self.size}-{self.color}".upper().replace(" ", "-")
        super().save(*args, **kwargs)