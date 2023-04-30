from django.urls import path
from .views import index, login, register, products, product, card, basket

urlpatterns = [
    path('', index, name='home'),
    path('login/', login, name='login'),
    path('register/', register, name='register'),
    path('products/', products, name='products'),
    path('product/<slug:slug>/', product, name='product'),
    path('card/', card, name='card'),
    path('basket/', basket, name='basket'),
]