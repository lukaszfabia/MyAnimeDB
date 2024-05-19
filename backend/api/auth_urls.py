from django.urls import path, re_path
from .views.auth_views import *
from .views.general_views import NoPage
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("register/", RegistrationView.as_view(), name="register"),
    path("settings/", SettingsView.as_view(), name="settings"),
    re_path(r"^.*$", NoPage.as_view(), name="fail"),
]