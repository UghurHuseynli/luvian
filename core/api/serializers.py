from rest_framework.serializers import ModelSerializer, SerializerMethodField
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist
from core.models import UserModel, ProductsModel, CategoryModel, CardModel

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['email'] = user.email

        return token
    
class UserModelSerializerList(ModelSerializer):
    class Meta:
        model = UserModel
        fields = ['name', 'email', 'password']

class UserModelSerializerCreate(ModelSerializer):
    class Meta:
        model = UserModel
        fields = ['name', 'email', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = UserModel(**validated_data)
        user.is_active = False
        user.set_password(password)
        user.save()
        return user

class CategorySerializer(ModelSerializer):
    class Meta:
        model = CategoryModel
        fields = ['id', 'name', 'parent_menu', 'is_navbar']

class ProductSerializer(ModelSerializer):
    img = SerializerMethodField()
    url = SerializerMethodField()
    
    def get_img(self, obj):
        return [element.img.url for element in obj.images.all()][0]
    
    def get_url(self, obj):
        return f'{obj.get_absolute_url()}'

    class Meta:
        model = ProductsModel
        fields = ['id', 'name', 'rating', 'description', 'price', 'img', 'url']

class ProductSerializerRetrive(ModelSerializer):
    discounted_price = SerializerMethodField()
    images = SerializerMethodField()

    def get_discounted_price(self, obj):
        if not obj.discount:
            return ''
        if obj.is_percent:
            return obj.price - obj.discount * obj.price / 100
        return obj.price - obj.discount
    
    def get_images(self, obj):
        return [element.img.url for element in obj.images.all()]

    class Meta:
        model = ProductsModel
        fields = ['id', 'name', 'rating', 'description', 'price', 'stock_size', 'discounted_price', 'images']

class CardSerializer(ModelSerializer):
    class Meta:
        model = CardModel
        fields = ['product', 'quantity']

    def create(self, validated_data):
        user = self.context['request'].user
        product = validated_data.pop('product')
        quantity = validated_data.pop('quantity')
        try:
            card = CardModel.objects.get(Q(user=user) & Q(product=product))
            card.quantity += quantity
            card.save()
            return card
        except(ObjectDoesNotExist):
            new_card = CardModel.objects.create(user=user, product=product, quantity=quantity)
            new_card.save()
            return new_card
    
class CardSerializerList(ModelSerializer):
    product = SerializerMethodField()
    user = SerializerMethodField()
    img = SerializerMethodField()
    price = SerializerMethodField()
    stock = SerializerMethodField()

    def get_product(self, obj):
        return obj.product.name

    def get_user(self, obj):
        return obj.user.email
    
    def get_img(self, obj):
        return obj.product.images.all()[0].img.url

    def get_price(self, obj):
        return obj.product.price

    def get_stock(self, obj):
        return obj.product.stock_size

    class Meta:
        model = CardModel
        fields = ['id', 'user', 'product', 'img', 'quantity', 'price', 'stock']

