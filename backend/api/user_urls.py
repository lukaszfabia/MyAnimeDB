from django.urls import path, re_path
from .views.user_views import *
from .views.general_views import NoPage

urlpatterns = [
    path("<str:username>", UserDataView.as_view(), name="user_data"),
    path("add-anime/<int:id>", AddAnimeToUser.as_view(), name="add_anime"),
    path("anime/list/", UsersAnimeList.as_view(), name="users_anime_list"),
    path("fav-anime/<str:username>", FavoriteAnime.as_view(), name="fav_anime"),
    path("stats/<str:username>", UserStats.as_view(), name="stats"),
    path("is-fav-anime/<int:id>", IsFavoriteAnime.as_view(), name="is_fav_anime"),
    path(
        "has-anime/<int:id>",
        IsOnUsersList.as_view(),
        name="check_is_on_list",
    ),
    re_path(r"^.*$", NoPage.as_view(), name="fail"),
]
