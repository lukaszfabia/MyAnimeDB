from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, JSONParser
from rest_framework import generics


from api.anime_serializers import AnimeSerializer
from api.models import *
from api.stats import AnalyseData
from api.user_serializers import UserAnimeSerializer, UserProfileSerializer


class AddAnimeToUser(
    generics.CreateAPIView, generics.UpdateAPIView, generics.RetrieveAPIView
):
    """Add anime to user or update it if it already exists"""

    serializer_class = UserAnimeSerializer
    permission_classes = [IsAuthenticated]

    def get_anime_and_profile(self, request, id):
        anime = get_object_or_404(Anime, id_anime=id)
        profile = get_object_or_404(UserProfile, user__username=request.user)
        return anime, profile

    def get(self, request, *args, **kwargs):
        try:
            anime, profile = self.get_anime_and_profile(request, kwargs["id"])
            users_anime = UsersAnime.objects.get(user=profile, id_anime=anime)
        except UsersAnime.DoesNotExist:
            return Response(
                {"error": "Anime does not exist"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = UserAnimeSerializer(users_anime)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        anime, profile = self.get_anime_and_profile(request, kwargs["id"])

        users_anime, created = UsersAnime.objects.get_or_create(
            user=profile, id_anime=anime
        )

        if created:
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
        anime, profile = self.get_anime_and_profile(request, kwargs["id"])
        users_anime = UsersAnime.objects.get(user=profile, id_anime=anime)

        data = request.data.copy()
        data["user"] = profile.pk
        data["id_anime"] = anime.id_anime
        if "is_favorite" in data:
            users_anime.is_favorite = data["is_favorite"]
            users_anime.save()

        serializer = UserAnimeSerializer(users_anime, data=data, partial=True)

        if serializer.is_valid():
            serializer.save()
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
        user = get_object_or_404(UserProfile, user__username=request.user)
        users_anime = UsersAnime.objects.filter(user=user).select_related("id_anime")
        serializer = self.serializer_class(users_anime, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class IsOnUsersList(generics.RetrieveAPIView):
    """Check if anime is on user's list"""

    permission_classes = [IsAuthenticated]
    serializer_class = AnimeSerializer
    queryset = Anime.objects.all()

    def get_queryset(self):
        return self.queryset.filter(id_anime=self.kwargs.get("id"))

    def get(self, request, id):
        user = UserProfile.objects.get(user__username=request.user)
        anime = self.get_queryset().first()
        users_anime = get_object_or_404(UsersAnime, user=user, id_anime=anime)
        if users_anime:
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_204_NO_CONTENT)


class UserStats(generics.ListAPIView):
    """includes total time spent during watching, fav genre, watched episodes"""

    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        # get users anime list
        username = kwargs.get("username")
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


class FavoriteAnime(generics.ListAPIView):
    """Get all favorite animes for user"""

    permission_classes = [AllowAny]
    queryset = UsersAnime.objects.all()
    serializer_class = AnimeSerializer

    def get(self, request, *args, **kwargs):
        user = get_object_or_404(
            UserProfile, user__username=self.kwargs.get("username")
        )
        favorite_animes = self.queryset.filter(user=user, is_favorite=True)
        anime = Anime.objects.filter(usersanime__in=favorite_animes)
        serializer = self.serializer_class(anime, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class IsFavoriteAnime(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    queryset = UsersAnime.objects.all()
    serializer_class = AnimeSerializer

    def get(self, request, *args, **kwargs):
        user = get_object_or_404(UserProfile, user__username=request.user)
        anime = get_object_or_404(Anime, id_anime=self.kwargs.get("id"))
        favorite_anime = self.queryset.filter(
            user=user, id_anime=anime, is_favorite=True
        )
        if favorite_anime:
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserDataView(generics.RetrieveAPIView):
    """Read only info for profile"""

    serializer_class = UserProfileSerializer
    permission_classes = [AllowAny]
    queryset = UserProfile.objects.all()
    lookup_field = "username"

    def get_object(self):
        return get_object_or_404(
            self.queryset, user__username=self.kwargs.get("username")
        )
