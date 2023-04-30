from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_200_OK, HTTP_406_NOT_ACCEPTABLE
from django.shortcuts import redirect

from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from .serializers import MyTokenObtainPairSerializer, UserModelSerializerList, UserModelSerializerCreate, CategorySerializer, ProductSerializer, ProductSerializerRetrive, CardSerializer, CardSerializerList
from core.models import UserModel, CategoryModel, ProductsModel, CardModel
from core.tokens import account_activation_token
from core.tasks import send_task
# Create your views here.

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class ActivateUserApiView(APIView):
    def get(self, request, *args, **kwargs):
        User = UserModel
        uidb64 = kwargs['uidb64']
        token = kwargs['token']

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.object.get(id=uid)
        except(TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and account_activation_token.check_token(user, token):
            user.is_active = True
            user.save()
            return redirect('login')
        return Response('Activation link is invalid!', status=HTTP_406_NOT_ACCEPTABLE)

class UserViewSet(ModelViewSet):
    queryset = UserModel.object.all()
    serializer_class = UserModelSerializerList
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_permissions(self):
        if self.request.method == 'POST':
            permission_classes = []
        else: 
            permission_classes = super().get_permissions()
        return permission_classes

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return UserModelSerializerList
        return UserModelSerializerCreate
    
    def create(self, request, *args, **kwargs):
        many = True if isinstance(request.data, list) else False
        serializer = UserModelSerializerCreate(data=request.data, many=many)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        subject = 'Activate your account'
        message = render_to_string('user-activate.html', {
            'user': user,
            'domain': get_current_site(request).domain,
            'uid': urlsafe_base64_encode(force_bytes(user.id)),
            'token': account_activation_token.make_token(user),
            'protocol': 'https' if request.is_secure() else 'http'
        })
        send_task.delay(subject, message, user.email)
        return Response({'message': f'Your account has been created. Please activate your account by going to the activation link sent to your {serializer.data.get("email")} e-mail.'}, status=HTTP_201_CREATED)

class CategoryViewSet(ModelViewSet):
    queryset = CategoryModel.objects.all()
    serializer_class = CategorySerializer
    permission_classes = []
    pagination_class = None

class ProductViewSet(ModelViewSet):
    queryset = ProductsModel.objects.all()
    serializer_class = ProductSerializer
    permission_classes = []
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductSerializerRetrive
        return ProductSerializer
        


    def get_queryset(self):
        queryset= super(ProductViewSet, self).get_queryset()

        category = self.request.GET.get('category')
        price = self.request.GET.get('price')

        if category:
            queryset = queryset.filter(category=category)

        if price:
            queryset = queryset.filter(price__lte=price)

        return queryset

class CardViewSet(ModelViewSet):
    queryset = CardModel.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = CardSerializer
    pagination_class = None

    def get_serializer_class(self):
        if self.request.method == 'GET' or self.request.method == 'PATCH':
            return CardSerializerList
        return CardSerializer

