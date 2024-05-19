from typing import Dict, List
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q

from api.serializers import (
    AnimeReviewSerializer,
    AnimeSerializer,
    UserAnimeSerializer,
    UserProfileSerializer,
)

from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, JSONParser


from api.models import Anime, AnimeReviews, Genre, UserProfile, UsersAnime
from api.stats import AnalyseAnime, AnalyseData
from api.preprocess_query import Preprocess


class RegistrationView(generics.CreateAPIView):
    """Register a user in the database"""

    serializer_class = UserProfileSerializer
    queryset = UserProfile.objects.all()
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, JSONParser]  # czy to jest potrzebne?

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        print(request.data)
        if serializer.is_valid():
            email = request.data.get("email")
            if email is None or UserProfile.objects.filter(user__email=email).exists():
                return Response(
                    {"error": "User with this email already exists"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            serializer.save()
            return Response(
                {
                    "message": "User registered successfully",
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetRoutesView(generics.ListAPIView):
    """Main view to all routes in the API"""

    permission_classes = [AllowAny]
    queryset = [
        {"route": "token/", "description": "Get JWT token"},
        {"route": "token/refresh/", "description": "Refresh JWT token"},
        {"route": "register/", "description": "Register a user"},
        {
            "route": "user/<str:username>",
            "description": "Get a users info like username.",
        },
        {
            "route": "anime/<str:title>",
            "description": "Get an anime by title",
        },
        {"route": "settings/", "description": "Get or update user settings"},
    ]

    def get(self, request, *args, **kwargs):
        return Response(self.queryset, status=status.HTTP_200_OK)


class UserDataView(generics.ListAPIView):
    """Read only info for profile"""

    serializer_class = UserProfileSerializer
    permission_classes = [AllowAny]

    def get(self, request, username):
        try:
            user = UserProfile.objects.get(user__username=username)
            serializer = self.serializer_class(user)
            return Response(
                serializer.data,
                status=status.HTTP_200_OK,
            )
        except UserProfile.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )


class SettingsView(generics.UpdateAPIView):
    """Change users profile information"""

    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer
    queryset = UserProfile.objects.all()

    def get_object(self):
        return self.request.user.profile

    def update(self, request, *args, **kwargs):
        print(request.data)
        serializer = self.get_serializer(
            self.get_object(), data=request.data, partial=True
        )
        print(serializer.is_valid())
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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

    def get_queryset(self):
        title = self.kwargs["title"]
        return Anime.objects.filter(title__contains=title)


class GetAnimeById(generics.RetrieveAPIView):
    """Get an anime by ID"""

    serializer_class = AnimeSerializer
    permission_classes = [AllowAny]

    def get(self, request, id):
        try:
            anime = Anime.objects.get(id_anime=id)
            serializer = self.serializer_class(anime)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response(
                {"error": "Anime does not exist"}, status=status.HTTP_404_NOT_FOUND
            )


class AddAnimeToUser(
    generics.CreateAPIView, generics.UpdateAPIView, generics.RetrieveAPIView
):
    """Add anime to user or update it if it already exists"""

    serializer_class = UserAnimeSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            anime = Anime.objects.get(id_anime=kwargs["id"])
            profile = UserProfile.objects.get(user__username=request.user)
            users_anime = UsersAnime.objects.get(user=profile, id_anime=anime)
        except:
            return Response(
                {"error": "Anime does not exist"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = UserAnimeSerializer(users_anime)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        try:
            anime = Anime.objects.get(id_anime=kwargs["id"])
            profile = UserProfile.objects.get(user__username=request.user)
        except:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        users_anime, created = UsersAnime.objects.get_or_create(
            user=profile, id_anime=anime
        )

        if created:
            print("created ?")
            data = {
                "user": profile.pk,
                "id_anime": anime.id_anime,
                "is_favorite": request.data.get("is_favorite") or False,
                "state": request.data.get("state") or "watching",
                "score": request.data.get("score") or 0,
            }
            serializer = UserAnimeSerializer(users_anime, data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"message": "Anime added for user"}, status=status.HTTP_201_CREATED
                )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(
                {"message": "Anime already exists for user"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def update(self, request, *args, **kwargs):
        try:
            anime = Anime.objects.get(id_anime=kwargs["id"])
            profile = UserProfile.objects.get(user__username=request.user)
            users_anime = UsersAnime.objects.get(user=profile, id_anime=anime)
        except:
            return Response({"error": "not found"}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()
        data["user"] = profile.pk
        data["id_anime"] = anime.id_anime
        print(data.get("is_favorite"))
        if "is_favorite" in data:
            users_anime.is_favorite = data["is_favorite"]
            users_anime.save()

        serializer = UserAnimeSerializer(users_anime, data=data, partial=True)

        if serializer.is_valid():
            serializer.save()
            print(serializer.data)
            return Response(
                {"message": "Anime updated for user"}, status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UsersAnimeList(generics.ListAPIView):
    """Get all animes for user"""

    permission_classes = [IsAuthenticated]
    serializer_class = UserAnimeSerializer
    queryset = Anime.objects.all()

    def get(self, request, *args, **kwargs):
        user = UserProfile.objects.get(user__username=request.user)
        users_anime = UsersAnime.objects.filter(user=user).select_related("id_anime")
        serializer = self.serializer_class(users_anime, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class IsOnUsersList(generics.RetrieveAPIView):
    """Check if anime is on user's list"""

    permission_classes = [IsAuthenticated]
    serializer_class = AnimeSerializer

    def get(self, request, id):
        user = UserProfile.objects.get(user__username=request.user)
        anime = Anime.objects.get(id_anime=id)
        try:
            users_anime = UsersAnime.objects.get(user=user, id_anime=anime)
            if users_anime:
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_204_NO_CONTENT)
        except UsersAnime.DoesNotExist:
            return Response(status=status.HTTP_204_NO_CONTENT)


class UserStats(generics.ListAPIView):
    """includes total time spent during watching, fav genre, watched episodes"""

    permission_classes = [AllowAny]

    def get(self, request, username):
        # get users anime list
        analysis = AnalyseData(username)
        return Response(
            {
                "useranme": username,
                "fav_genres": analysis.get_fav_genre(),
                "total_time": analysis.get_total_time(),
                "watched_episodes": analysis.get_watched_episodes(),
            },
            status=status.HTTP_200_OK,
        )


class GetAllAnimeProps(generics.ListAPIView):
    """Get all genres for anime"""

    permission_classes = [AllowAny]
    queryset = []

    def get(self, request, *args, **kwargs):
        result: List[Dict] = list()

        genres = {
            "genres": [
                {"id": genre.id_genre, "name": genre.name}
                for genre in Genre.objects.all()
            ]
        }

        types = {
            "types": [
                {"id": id, "name": type[1]} for id, type in enumerate(Anime.ANIME_TYPE)
            ]
        }

        status_of_anime = {
            "status": [
                {"id": id, "name": status[1]}
                for id, status in enumerate(Anime.ANIME_STATUS)
            ]
        }

        result.append(genres)
        result.append(types)
        result.append(status_of_anime)

        return Response({"props": result}, status=status.HTTP_200_OK)


class Review(generics.CreateAPIView, generics.ListAPIView, generics.DestroyAPIView):
    """Add review to anime or update it if it already exists, get all reviews for anime"""

    permission_classes = [IsAuthenticated]
    serializer_class = AnimeReviewSerializer

    def post(self, request, *args, **kwargs):
        user_profile = UserProfile.objects.get(user=request.user)
        anime_id = kwargs["id"]
        try:
            anime = Anime.objects.get(id_anime=anime_id)
        except Anime.DoesNotExist:
            return Response(
                {"error": "Anime does not exist"}, status=status.HTTP_404_NOT_FOUND
            )

        review_text = request.data.get("review")
        review, created = AnimeReviews.objects.get_or_create(
            user=user_profile, anime=anime
        )

        serializer = self.serializer_class(
            review, data={"review": review_text}, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            message = "Review added" if created else "Review updated"
            return Response(
                {"message": message},
                status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, **kwargs):
        anime_id = kwargs["id"]
        try:
            anime = Anime.objects.get(id_anime=anime_id)
        except Anime.DoesNotExist:
            return Response(
                {"error": "Anime does not exist"}, status=status.HTTP_404_NOT_FOUND
            )

        reviews = AnimeReviews.objects.filter(anime=anime)
        serializer = self.serializer_class(reviews, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        user_profile = UserProfile.objects.get(user=request.user)
        anime_id = kwargs["id"]
        try:
            anime = Anime.objects.get(id_anime=anime_id)
        except Anime.DoesNotExist:
            return Response(
                {"error": "Anime does not exist"}, status=status.HTTP_404_NOT_FOUND
            )

        try:
            review = AnimeReviews.objects.get(user=user_profile, anime=anime)
        except AnimeReviews.DoesNotExist:
            return Response(
                {"error": "Review does not exist"}, status=status.HTTP_404_NOT_FOUND
            )

        review.delete()
        return Response({"message": "Review deleted"}, status=status.HTTP_200_OK)


class FavoriteAnime(generics.ListAPIView):
    """Get all favorite animes for user"""

    permission_classes = [AllowAny]
    queryset = UsersAnime.objects.all()
    serializer_class = AnimeSerializer

    def get(self, request, username, **kwargs):
        user = UserProfile.objects.get(user__username=username)
        favorite_animes = self.queryset.filter(user=user, is_favorite=True)
        anime = Anime.objects.filter(usersanime__in=favorite_animes)
        serializer = self.serializer_class(anime, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class IsFavoriteAnime(generics.RetrieveAPIView):

    permission_classes = [IsAuthenticated]
    queryset = UsersAnime.objects.all()
    serializer_class = AnimeSerializer

    def get(self, request, id, *args, **kwargs):
        user = UserProfile.objects.get(user__username=request.user)
        anime = Anime.objects.get(id_anime=id)
        favorite_anime = self.queryset.filter(
            user=user, id_anime=anime, is_favorite=True
        )
        if favorite_anime:
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_204_NO_CONTENT)


class StatsForAnime(generics.RetrieveAPIView):
    """Compute average score for anime"""

    permission_classes = [AllowAny]
    queryset = UsersAnime.objects.all()

    def get(self, request, id):
        try:
            anime = Anime.objects.get(id_anime=id)
        except:
            return Response(
                {"error": "Anime does not exist"}, status=status.HTTP_404_NOT_FOUND
            )

        animes = self.queryset.filter(id_anime=anime)
        return Response(
            {
                "title": anime.title,
                "average_score": AnalyseAnime.compute_avg_rating(animes),
                "popularity": AnalyseAnime.get_popularity(anime.title),
            },
            status=status.HTTP_200_OK,
        )


class NoPage(generics.GenericAPIView):
    """No page if route does not exist"""

    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"error": "Page not found"}, status=status.HTTP_404_NOT_FOUND)
