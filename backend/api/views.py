from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from api.serializers import (
    AnimeReviewSerializer,
    AnimeSerializer,
    UserAnimeSerializer,
    UserProfileSerializer,
)

from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, JSONParser


from api.models import Anime, AnimeReviews, UserProfile, UsersAnime
from api.stats import AnalyseData

# from backend import settings


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
    queryset = []

    def get(self, request):
        routes = [
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
            {"route": "user-data/", "description": "Get user data"},
            {"route": "settings/", "description": "Get or update user settings"},
        ]

        return Response(routes)


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


#### endpoints with getting data


class AllAnime(generics.ListAPIView):
    """Get all animes"""

    queryset = Anime.objects.all()
    serializer_class = AnimeSerializer
    permission_classes = [IsAuthenticated]


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
        except Anime.DoesNotExist:
            raise Response(
                {"error": "Anime does not exist"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.serializer_class(anime)
        return Response(serializer.data, status=status.HTTP_200_OK)


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
        except Anime.DoesNotExist:
            return Response(
                {"error": "Anime does not exist"}, status=status.HTTP_404_NOT_FOUND
            )
        except UserProfile.DoesNotExist:
            return Response(
                {"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND
            )
        except UsersAnime.DoesNotExist:
            return Response(
                {"error": "User's anime does not exist"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = UserAnimeSerializer(users_anime)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        try:
            anime = Anime.objects.get(id_anime=request.data.get("id_anime"))
            profile = UserProfile.objects.get(user__username=request.user)
        except Anime.DoesNotExist:
            return Response(
                {"error": "Anime does not exist"}, status=status.HTTP_404_NOT_FOUND
            )
        except UserProfile.DoesNotExist:
            return Response(
                {"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND
            )

        users_anime, created = UsersAnime.objects.get_or_create(
            user=profile, id_anime=anime
        )
        if created:
            serializer = UserAnimeSerializer(users_anime, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"message": "Anime added for user"}, status=status.HTTP_201_CREATED
                )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(
                {"message": "Anime already added for user"}, status=status.HTTP_200_OK
            )

    def update(self, request, *args, **kwargs):
        try:
            anime = Anime.objects.get(id_anime=request.data.get("id_anime"))
            profile = UserProfile.objects.get(user__username=request.user)
            # print(profile)
            users_anime = UsersAnime.objects.get(user=profile, id_anime=anime)
        except Anime.DoesNotExist:
            return Response(
                {"error": "Anime does not exist"}, status=status.HTTP_404_NOT_FOUND
            )
        except UserProfile.DoesNotExist:
            return Response(
                {"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND
            )
        except UsersAnime.DoesNotExist:
            return Response(
                {"error": "User's anime does not exist"},
                status=status.HTTP_404_NOT_FOUND,
            )

        data = request.data.copy()
        data["user"] = profile.pk
        data["id_anime"] = anime.id_anime
        serializer = UserAnimeSerializer(users_anime, data=data, partial=True)
        # print(serializer)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Anime updated for user"}, status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UsersAnimeList(generics.ListAPIView):
    """Get all animes for user"""

    permission_classes = [AllowAny]
    serializer_class = AnimeSerializer
    queryset = Anime.objects.all()

    def get(self, request, username):
        user = UserProfile.objects.get(user__username=username)
        users_anime = UsersAnime.objects.filter(user=user)
        anime = Anime.objects.filter(usersanime__in=users_anime)
        serializer = self.serializer_class(anime, many=True)
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


class SearchAnime(generics.ListAPIView):
    """searching anime with given kwargs"""

    permission_classes = [AllowAny]
    ...


class Review(
    generics.CreateAPIView,
    generics.UpdateAPIView,
    generics.ListAPIView,
    generics.DestroyAPIView,
):
    """Add review to anime or update it if it already exists, get all reviews for anime"""

    permission_classes = [IsAuthenticated]
    serializer_class = AnimeReviewSerializer

    def create(self, request, *args, **kwargs):
        user = UserProfile.objects.get(user__username=request.user)
        anime = Anime.objects.get(id_anime=kwargs["id"])

        if AnimeReviews.objects.filter(user=user, anime=anime):
            return Response(
                {"error": "Review already exists"}, status=status.HTTP_400_BAD_REQUEST
            )

        review = request.data.get("review")
        serializer = AnimeReviewSerializer(
            data={"user": user.id, "anime": anime.id_anime, "review": review},
        )
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Review added"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        user = UserProfile.objects.get(user__username=request.user)
        anime = Anime.objects.get(id_anime=kwargs["id"])

        review = request.data.get("review")
        try:
            instance = AnimeReviews.objects.get(user=user, anime=anime)
        except AnimeReviews.DoesNotExist:
            return Response(
                {"error": "Review does not exist"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = AnimeReviewSerializer(
            instance, data={"review": review}, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Review changed"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, **kwargs):
        try:
            anime = Anime.objects.get(id_anime=kwargs["id"])
            reviews = AnimeReviews.objects.filter(anime=anime)
            serializer = AnimeReviewSerializer(reviews, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Anime.DoesNotExist:
            return Response(
                {"error": "Anime does not exist"}, status=status.HTTP_404_NOT_FOUND
            )

    def destroy(self, request, *args, **kwargs):
        user = UserProfile.objects.get(user__username=request.user)
        anime = Anime.objects.get(id_anime=kwargs["id"])

        try:
            review = AnimeReviews.objects.get(user=user, anime=anime)
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


class NoPage(generics.GenericAPIView):
    """No page if route does not exist"""

    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"error": "Page not found"}, status=status.HTTP_404_NOT_FOUND)
