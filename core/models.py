from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import UserManager
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils.text import slugify
from django.urls import reverse, reverse_lazy

# Create your models here.

class UserModel(AbstractUser):
    username = None
    name = models.CharField(max_length=20, null=True, blank=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=256)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = [field for field in AbstractUser.REQUIRED_FIELDS if field != 'email']

    object = UserManager()

    def __str__(self) -> str:
        return self.email

class CategoryModel(models.Model):
    name = models.CharField(max_length=100)
    parent_menu = models.ForeignKey('CategoryModel', blank=True, null=True, on_delete=models.CASCADE)
    is_navbar = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.name

class ProductsModel(models.Model):
    name = models.CharField(max_length=100)

    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.0)])
    discount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, validators=[MinValueValidator(0.0)])
    is_percent = models.BooleanField(default=False)
    stock_size = models.PositiveIntegerField()

    rating = models.DecimalField(max_digits=4, decimal_places=2, validators=[MinValueValidator(0.0), MaxValueValidator(5.0)])
    created_at = models.DateTimeField(auto_now_add=True)
    slug = models.SlugField(null=True, blank=True, max_length=2000)
    description = models.TextField()
    category = models.ForeignKey(CategoryModel, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return self.name
    
    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(ProductsModel, self).save(*args, **kwargs)
    
    def get_absolute_url(self):
        return reverse('product', kwargs={'slug': self.slug})

# class ProductColorModel(models.Model):
#     color_code = models.CharField(max_length=100)

#     def __str__(self) -> str:
#         return f'{self.color_code}'

# class ProductSizeModel(models.Model):
#     size = models.CharField(max_length=20)

#     def __str__(self) -> str:
#         return f'{self.size}'
    
# class ProductVersionModel(models.Model):
#     price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.0)])
#     discount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, validators=[MinValueValidator(0.0)])
#     is_percent = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, validators=[MinValueValidator(0.0), MaxValueValidator(100.0)])
#     stock_size = models.PositiveIntegerField()
#     product = models.ForeignKey(ProductsModel, on_delete=models.CASCADE)
#     color = models.ForeignKey(ProductColorModel, on_delete=models.CASCADE)
#     size = models.ForeignKey(ProductSizeModel, on_delete=models.CASCADE)

#     def __str__(self) -> str:
#         return f'{self.product.name} -- {self.id}'

class ImageModel(models.Model):
    img = models.ImageField(upload_to='products/')
    product_version = models.ForeignKey(ProductsModel, on_delete=models.CASCADE, related_name='images')

    def __str__(self) -> str:
        return f'{self.img}'

class CardModel(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    product = models.ForeignKey(ProductsModel, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

    def __str__(self) -> str:
        return f'{self.user.email} -- {self.id}'