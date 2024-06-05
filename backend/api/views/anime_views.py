from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import generics


from api.anime_serializers import *
from api.models import *
from api.preprocess_query import Preprocess
from api.stats import AnalyseAnime


class SearchAnime(generics.ListAPIView):
    """
    API view to search for anime.

    This view returns a list of anime based on the provided search keywords.

    Parameters:
        - keywords (str): The search keywords to filter the anime.

    Returns:
        A JSON response containing a list of serialized anime objects.

    Endpoint example:
        GET /api/anime/keywords=death

    Notes:
        - Allow any user to access this view.

    """

    serializer_class = AnimeSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        preprocess_query = Preprocess(self.kwargs.get("keywords", "all"))
        return preprocess_query.get_result()

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetAnimeByTitle(generics.ListAPIView):
    """
    Api view to get anime by title.

    This view returns a list of anime based on the provided title.

    Parameters:
        - title (str): The title of the anime to filter.

    Returns:
        A JSON response containing a list of serialized anime objects.

    Endpoint example:

        GET /api/anime/title/death note

    Notes:
        - Unused, for future use.
    """

    serializer_class = AnimeSerializer
    permission_classes = [AllowAny]
    queryset = Anime.objects.all()
    lookup_field = "title"


class GetAnimeById(generics.RetrieveAPIView):
    """
    Api view to get anime by id.

    This view returns a object of anime based on the provided id.

    Parameters:
        - id_anime (int): The id of the anime to filter.

    Returns:
        A JSON response containing searched anime.

    Endpoint example:

        GET /api/anime/1

    Notes:
        - Allow any user to access this view.
    """

    serializer_class = AnimeSerializer
    permission_classes = [AllowAny]
    queryset = Anime.objects.all()
    lookup_field = "id_anime"


class GetAllAnimeProps(generics.ListAPIView):
    """
    API view to get all genres, types, and status for anime.

    This view returns a JSON response containing the genres, types, and status
    available for anime in the database.

    Methods:
    - get_genres: Get all genres for anime.
    - get_types: Get all types for anime.
    - get_status: Get all status for anime.
    - get: Handle GET requests and return the JSON response.

    Returns:
        A JSON response containing the genres, types, and status for anime.

    Endpoint example:
        GET /api/anime/props/

    Notes:
        - Allow any user to access this view.
    """

    permission_classes = [AllowAny]
    queryset = []

    def get_genres(self):
        """
        Get all genres for anime.

        Returns:
        A dictionary containing the genres with their respective IDs and names.
        """
        return {
            "genres": [
                {"id": genre.id_genre, "name": genre.name}
                for genre in Genre.objects.all()
            ]
        }

    def get_types(self):
        """
        Get all types for anime.

        Returns:
        A dictionary containing the types with their respective IDs and names.
        """
        return {
            "types": [
                {"id": id, "name": type[1]} for id, type in enumerate(Anime.ANIME_TYPE)
            ]
        }

    def get_status(self):
        """
        Get all status for anime.

        Returns:
        A dictionary containing the status with their respective IDs and names.
        """
        return {
            "status": [
                {"id": id, "name": status[1]}
                for id, status in enumerate(Anime.ANIME_STATUS)
            ]
        }

    def get(self, request, *args, **kwargs):
        """
        Handle GET requests and return the JSON response.

        Returns:
        A JSON response containing the genres, types, and status for anime.
        """
        result = [self.get_genres(), self.get_types(), self.get_status()]
        return Response({"props": result}, status=status.HTTP_200_OK)


class Review(generics.CreateAPIView, generics.ListAPIView, generics.DestroyAPIView):
    """
    Add review to anime or update it if it already exists, get all reviews for anime.

    This class provides the functionality to add a review to an anime or update an existing review,
    as well as retrieve all reviews for a specific anime.

    Parameters:
        - id: The ID of the anime to add or retrieve reviews for.

    Methods:
        get_queryset(): Retrieves the queryset of reviews for the anime.
        perform_create(serializer): Performs the creation of a new review.
        perform_destroy(instance): Performs the deletion of a review.

    Returns:
        A JSON response containing the reviews for the anime.

    Endpoint example:
        (GET, PUT, DELETE) /api/anime/reviews/1

    Notes:
        - Only authenticated users can access this view.
    """

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
    """
    Retrieve and compute statistics for a specific anime.

    This view retrieves information about a specific anime, including its title,
    average score, and popularity. The average score is computed by analyzing the
    ratings of the anime, and the popularity is determined based on the title.

    Endpoint example: /api/anime/score/<id> (GET)

    Parameters:
        - id: The ID of the anime to retrieve statistics for.

    Returns:
        A JSON response containing the following fields:
        - title: The title of the anime.
        - average_score: The average score of the anime.
        - popularity: The popularity of the anime.

    Notes:
        - AllowAny: This view can be accessed by any user, authenticated or not.
    """

    permission_classes = [AllowAny]
    queryset = UsersAnime.objects.all()

    def retrieve(self, request, *args, **kwargs):
        anime = get_object_or_404(Anime, id_anime=kwargs["id"])
        animes = self.get_queryset().filter(id_anime=anime)

        return Response(
            {
                "title": anime.title,
                "average_score": AnalyseAnime.compute_avg_rating(animes),
                "popularity": AnalyseAnime.fix_popularity(anime.title),
            },
            status=status.HTTP_200_OK,
        )


class MostPopularAnimes(generics.ListAPIView):
    """
    Api view to get the most popular animes.

    This view returns a list of the most popular animes in the database. It takes
    the top 3 animes based on their popularity.

    Endpoint example: /api/anime/most_popular/ (GET)

    Returns:
        A JSON response containing a list of serialized anime objects.

    Notes:
        - AllowAny: This view can be accessed by any user, authenticated or not.
    """

    permission_classes = [AllowAny]
    serializer_class = AnimeSerializer

    def get_queryset(self):
        return Anime.objects.all().order_by("-popularity")[:3]

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RandomAnime(generics.RetrieveAPIView):
    """
    Api view to get a random anime.

    This view returns a random anime from the database.

    Endpoint example: /api/anime/random/ (GET)

    Returns:
        A JSON response containing a serialized anime object.

    Notes:
        - AllowAny: This view can be accessed by any user, authenticated or not.
    """

    permission_classes = [AllowAny]
    serializer_class = AnimeSerializer
    queryset = Anime.objects.all()

    def get(self, request, *args, **kwargs):
        anime = self.queryset.order_by("?").first()
        serializer = self.serializer_class(anime)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AnimeCharacters(generics.ListAPIView):
    """
    Api view to get anime characters.

    This view returns a list of characters for a specific anime.

    Parameters:
        - id (int): The id of the anime to filter.

    Endpoint example: /api/anime/characters/1 (GET)

    Returns:
        A JSON response containing a list of serialized character objects.

    Notes:
        - AllowAny: This view can be accessed by any user, authenticated or not.

    """

    permission_classes = [AllowAny]
    serializer_class = CharacterSerializer

    def get_queryset(self):
        anime = get_object_or_404(Anime, id_anime=self.kwargs["id"])
        characters = anime.characters.all()
        return characters

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
