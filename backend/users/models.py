from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    email      = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50, blank=True)
    last_name  = models.CharField(max_length=50, blank=True)
    phone      = models.CharField(max_length=20, blank=True)
    is_active  = models.BooleanField(default=True)
    is_staff   = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD  = "email"
    REQUIRED_FIELDS = []

    class Meta:
        db_table = "users"
        verbose_name = "User"
        verbose_name_plural = "Users"

    def __str__(self):
        return self.email

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()


class Address(models.Model):
    ADDRESS_TYPES = [
        ("home",   "Home"),
        ("office", "Office"),
        ("other",  "Other"),
    ]

    user         = models.ForeignKey(User, on_delete=models.CASCADE, related_name="addresses")
    label        = models.CharField(max_length=20, choices=ADDRESS_TYPES, default="home")
    full_name    = models.CharField(max_length=100)
    phone        = models.CharField(max_length=20)
    address_line = models.CharField(max_length=255)
    city         = models.CharField(max_length=100)
    province     = models.CharField(max_length=100)
    postal_code  = models.CharField(max_length=10, blank=True)
    is_default   = models.BooleanField(default=False)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "user_addresses"
        ordering = ["-is_default", "-created_at"]

    def __str__(self):
        return f"{self.full_name} — {self.city}"

    def save(self, *args, **kwargs):
        # Agar yeh default hai toh baaki sab ka default hatao
        if self.is_default:
            Address.objects.filter(user=self.user, is_default=True).update(is_default=False)
        super().save(*args, **kwargs)