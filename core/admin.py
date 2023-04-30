from django.contrib import admin
from .models import UserModel, CategoryModel, ProductsModel, ImageModel, CardModel

# Register your models here.
class ProductsModelAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ['name',]}

admin.site.register([UserModel, CategoryModel, ImageModel, CardModel])
admin.site.register(ProductsModel, ProductsModelAdmin)