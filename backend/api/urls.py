from django.urls import path, re_path
from . import views
from .views import GetRoutesView, RegistrationView, UserDataView, SettingsView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path("", GetRoutesView.as_view(), name="get_routes"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("register/", RegistrationView.as_view(), name="register"),
    path("user/<str:username>", views.get_user, name="getuser"),
    path("user/id/<int:id>", views.get_user_by_id, name="getuser"),
    path("anime/<str:title>", view=views.get_anime_by_title, name="getanime"),
    path("user-data/", UserDataView.as_view(), name="user_data"),
    path("user/settings/", SettingsView.as_view(), name="settings"),
    # path("add/anime/", AddAnimeView.as_view(), name="add_anime"),
    re_path(r"^.*$", views.fail, name="fail_route"),
]
