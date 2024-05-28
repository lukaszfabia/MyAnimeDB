from django.urls import path, re_path
from .views.anime_views import *
from .views.general_views import NoPage


urlpatterns = [
    # path("<str:title>", GetAnimeByTitle.as_view(), name="anime_by_title"), unused
    path("<int:id_anime>", GetAnimeById.as_view(), name="anime_by_id"),
    path("reviews/<int:id>", Review.as_view(), name="add_review"),
    path("score/<int:id>", StatsForAnime.as_view(), name="add_review"),
    path("search/<str:keywords>", SearchAnime.as_view(), name="search"),
    path("props/", GetAllAnimeProps.as_view(), name="all_genres"),
    path("most_popular/", MostPopularAnimes.as_view(), name="most_popular"),
    path("random/", RandomAnime.as_view(), name="random"),
    re_path(r"^.*$", NoPage.as_view(), name="fail"),
]
