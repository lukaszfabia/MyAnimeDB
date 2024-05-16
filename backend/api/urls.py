from django.urls import path, re_path
from .views import (
    AddAnimeToUser,
    AllAnime,
    FavoriteAnime,
    GetAnimeById,
    GetAnimeByTitle,
    GetRoutesView,
    IsOnUsersList,
    NoPage,
    RegistrationView,
    UserDataView,
    SettingsView,
    Review,
    UserStats,
    UsersAnimeList,
)

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path("", GetRoutesView.as_view(), name="get_routes"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("register/", RegistrationView.as_view(), name="register"),
    path("user/<str:username>", UserDataView.as_view(), name="user_data"),
    path("anime/<str:title>", GetAnimeByTitle.as_view(), name="anime_by_title"),
    path("animeid/<int:id>", GetAnimeById.as_view(), name="anime_by_id"),
    path("user/settings/", SettingsView.as_view(), name="settings"),
    path("user/add-anime/<int:id>", AddAnimeToUser.as_view(), name="add_anime"),
    path("anime/reviews/<int:id>", Review.as_view(), name="add_review"),
    path("user/fav-anime/<str:username>", FavoriteAnime.as_view(), name="fav_anime"),
    path("all-anime/", AllAnime.as_view(), name="all_anime"),
    path("user/stats/<str:username>", UserStats.as_view(), name="stats"),
    path("user/anime/list/<str:username>", UsersAnimeList.as_view(), name="stats"),
    path(
        "user/has-anime/<int:id>",
        IsOnUsersList.as_view(),
        name="check_is_on_list",
    ),
    re_path(r"^.*$", NoPage.as_view(), name="fail"),
]
