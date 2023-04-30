from django.shortcuts import render


def index(request):
    return render(request, 'index.html')

def login(request):
    return render(request, 'login.html')

def register(request):
    return render(request, 'register.html')

def products(request):
    return render(request, 'products.html')

def product(request, slug):
    return render(request, 'product.html')

def card(request):
    return render(request, 'card.html')

def basket(request):
    return render(request, 'basket.html')

