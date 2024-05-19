from django.urls import path, re_path
from .views import (
    AddAnimeToUser,
    AllAnime,
    FavoriteAnime,
    GetAllAnimeProps,
    GetAnimeById,
    GetAnimeByTitle,
    GetRoutesView,
    IsFavoriteAnime,
    IsOnUsersList,
    NoPage,
    RegistrationView,
    SearchAnime,
    StatsForAnime,
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
    path("user/settings/", SettingsView.as_view(), name="settings"),
    path("user/add-anime/<int:id>", AddAnimeToUser.as_view(), name="add_anime"),
    path("user/anime/list/", UsersAnimeList.as_view(), name="users_anime_list"),
    path("user/fav-anime/<str:username>", FavoriteAnime.as_view(), name="fav_anime"),
    path("user/stats/<str:username>", UserStats.as_view(), name="stats"),
    path("user/is-fav-anime/<int:id>", IsFavoriteAnime.as_view(), name="is_fav_anime"),
    path("anime/<str:title>", GetAnimeByTitle.as_view(), name="anime_by_title"),
    path("animeid/<int:id>", GetAnimeById.as_view(), name="anime_by_id"),
    path("anime/reviews/<int:id>", Review.as_view(), name="add_review"),
    path("anime/", AllAnime.as_view(), name="all_anime"),
    path(
        "user/has-anime/<int:id>",
        IsOnUsersList.as_view(),
        name="check_is_on_list",
    ),
    path("anime/score/<int:id>", StatsForAnime.as_view(), name="add_review"),
    path("search/anime/<str:keywords>", SearchAnime.as_view(), name="search"),
    path("anime/props/", GetAllAnimeProps.as_view(), name="all_genres"),
    re_path(r"^.*$", NoPage.as_view(), name="fail"),
]
