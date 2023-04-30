from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView, TokenBlacklistView
from rest_framework.routers import DefaultRouter
from .views import MyTokenObtainPairView, UserViewSet, ActivateUserApiView, CategoryViewSet, ProductViewSet, CardViewSet

router = DefaultRouter()
router.register(r'user', UserViewSet)
router.register(r'category', CategoryViewSet)
router.register(r'product', ProductViewSet)
router.register(r'card', CardViewSet)


urlpatterns = [
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('activate/<uidb64>/<token>', ActivateUserApiView.as_view(), name='activate_user'),
    path('token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),
    path('', include(router.urls)),
]