from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, JSONParser
from rest_framework import generics


from api.anime_serializers import *
from api.models import *
from api.preprocess_query import Preprocess
from api.stats import AnalyseAnime


class SearchAnime(generics.ListAPIView):
    """Get all animes"""

    serializer_class = AnimeSerializer
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        preprocess_query = Preprocess(kwargs.get("keywords", "all"))
        queryset = preprocess_query.get_result()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetAnimeByTitle(generics.ListAPIView):
    """Get an anime by title"""

    serializer_class = AnimeSerializer
    permission_classes = [AllowAny]
    queryset = Anime.objects.all()
    lookup_field = "title"


class GetAnimeById(generics.RetrieveAPIView):
    """Get an anime by ID"""

    serializer_class = AnimeSerializer
    permission_classes = [AllowAny]
    queryset = Anime.objects.all()
    lookup_field = "id_anime"


class GetAllAnimeProps(generics.ListAPIView):
    """Get all genres for anime"""

    permission_classes = [AllowAny]
    queryset = []

    def get_genres(self):
        return {
            "genres": [
                {"id": genre.id_genre, "name": genre.name}
                for genre in Genre.objects.all()
            ]
        }

    def get_types(self):
        return {
            "types": [
                {"id": id, "name": type[1]} for id, type in enumerate(Anime.ANIME_TYPE)
            ]
        }

    def get_status(self):
        return {
            "status": [
                {"id": id, "name": status[1]}
                for id, status in enumerate(Anime.ANIME_STATUS)
            ]
        }

    def get(self, request, *args, **kwargs):
        result = [self.get_genres(), self.get_types(), self.get_status()]
        return Response({"props": result}, status=status.HTTP_200_OK)


class Review(generics.CreateAPIView, generics.ListAPIView, generics.DestroyAPIView):
    """Add review to anime or update it if it already exists, get all reviews for anime"""

    permission_classes = [IsAuthenticated]
    serializer_class = AnimeReviewSerializer

    def get_queryset(self):
        user = self.request.user
        anime = get_object_or_404(Anime, id_anime=self.kwargs.get("id"))

        user_review = list(AnimeReviews.objects.filter(anime=anime, user__user=user))
        other_reviews = list(
            AnimeReviews.objects.filter(anime=anime).exclude(user__user=user)
        )

        return user_review + other_reviews

    def perform_create(self, serializer):
        user_profile = UserProfile.objects.get(user=self.request.user)
        anime = get_object_or_404(Anime, id_anime=self.kwargs["id"])
        review, created = AnimeReviews.objects.update_or_create(
            user=user_profile,
            anime=anime,
            defaults={"review": serializer.validated_data.get("review")},
        )
        if created:
            serializer.instance = review

    def perform_destroy(self, instance):
        user_profile = UserProfile.objects.get(user=self.request.user)
        anime = get_object_or_404(Anime, id_anime=self.kwargs["id"])
        review = get_object_or_404(AnimeReviews, user=user_profile, anime=anime)
        review.delete()


class StatsForAnime(generics.RetrieveAPIView):
    """Compute average score for anime"""

    permission_classes = [AllowAny]
    queryset = UsersAnime.objects.all()

    def retrieve(self, request, *args, **kwargs):
        anime = get_object_or_404(Anime, id_anime=kwargs["id"])
        animes = self.get_queryset().filter(id_anime=anime)

        return Response(
            {
                "title": anime.title,
                "average_score": AnalyseAnime.compute_avg_rating(animes),
                "popularity": AnalyseAnime.get_popularity(anime.title),
            },
            status=status.HTTP_200_OK,
        )
