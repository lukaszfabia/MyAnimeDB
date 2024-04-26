from django.urls import path
from . import views
from .views import MyTokenObtainPairSerializer, RegistrationView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('', views.get_routes), 
    path('token/', TokenObtainPairView.as_view(serializer_class = MyTokenObtainPairSerializer), name='token_obtain_pair'),    
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegistrationView.as_view(), name='register'),
    path('getuser/<str:username>', views.get_user, name='getuser'),
    path('getanime/<int:id>', views.get_anime, name='getanime'),
]