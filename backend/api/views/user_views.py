from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import generics
from rest_framework.permissions import IsAdminUser

from api.anime_serializers import AnimeSerializer
from api.models import *
from api.stats import AnalyseData
from api.user_serializers import (
    PostSerializer,
    UserAnimeSerializer,
    UserProfileSerializer,
)


class AddAnimeToUser(
    generics.CreateAPIView, generics.UpdateAPIView, generics.RetrieveAPIView
):
    """Api view for adding anime to user list
    
    TODO: Implement DELETE method
    
    Parameters:
        - id (int): id of anime
    
    Returns:
        - Response: status code 201 if anime added, 200 if updated, 404 if not found
        
    Endpoint example:
        - /api/user/add-anime/<int:id>
        
    Notes:
        - This view is allowed for authenticated users
        - If anime is already on list, it will be updated
    
    """

    serializer_class = UserAnimeSerializer
    permission_classes = [IsAuthenticated]

    def get_anime_and_profile(self, request, id):
        anime = get_object_or_404(Anime, id_anime=id)
        profile = get_object_or_404(UserProfile, user__username=request.user)
        return anime, profile

    def get(self, request, *args, **kwargs):
        """
        
        """
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
        """Adding anime to user list with POST request, with given parameters"""
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
                # increment popularity
                anime.popularity += 1
                anime.save()
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
        """Changing state of anime for user with PUT request, with given parameters"""
        anime, profile = self.get_anime_and_profile(request, kwargs["id"])
        users_anime = UsersAnime.objects.get(user=profile, id_anime=anime)

        if request.data.get("state") != "plan-to-watch":
            anime.popularity += 1
        elif anime.popularity > 0:
            anime.popularity -= 1
        anime.save()

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
    """Api view for getting all animes for user 
    
    Returns:
        - Response: List of all animes for user
        
    Endpoint example:
        - /api/user/anime/list/
        
    Notes:
        - This view is allowed for authenticated users
    
    """

    permission_classes = [IsAuthenticated]
    serializer_class = UserAnimeSerializer
    queryset = Anime.objects.all()

    def get(self, request, *args, **kwargs):
        user = get_object_or_404(UserProfile, user__username=request.user)
        users_anime = UsersAnime.objects.filter(user=user).select_related("id_anime")
        serializer = self.serializer_class(users_anime, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class IsOnUsersList(generics.RetrieveAPIView):
    """Api view for checking if anime is on user list
    
    Parameters:
        - id (int): id of anime
        
    Returns:
        - Response: status code 200 if anime is on list, 204 if not
        
    Endpoint example:
        - /api/user/has-anime/<int:id>
        
    Notes:
        - This view is allowed for authenticated users
    
    """

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
    """Api view for getting user stats
    
    Get all user stats like down below
    
    Parameters:
        - username (str): username of user
    
    Returns:
        - Response: User stats
        
    Endpoint example:
        - /api/user/stats/<username>
    
    """

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
    """Api view for getting favorite animes for user
    
    Parameters:
        - username (str): username of user
        
    Returns:
        - Response: List of favorite animes
        
    Endpoint example:
        - /api/user/fav-anime/<str:username>
        
    Notes:
        - This view is allowed for all users
    
    """

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
    """
    Api view for checking if anime is favorite for user
    
    Parameters:
        - id (int): id of anime
        
    Returns:
        - Response: status code 200 if anime is favorite, 204 if not
        
    Endpoint example:
        - /api/user/is-fav-anime/<int:id>
    
    Notes:
        - This view is allowed for authenticated users
    """
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
    """Api view for getting user profile data
    
    Parameters:
        - username (str): username of user
        
    Returns:
        - Response: User profile data
        
    Endpoint example: 
        - /api/user/<username>
        
    Notes:
        - This view is allowed for all users
    
    """

    serializer_class = UserProfileSerializer
    permission_classes = [AllowAny]
    queryset = UserProfile.objects.all()
    lookup_field = "username"

    def get_object(self):
        return get_object_or_404(
            self.queryset, user__username=self.kwargs.get("username")
        )


class GetPosts(generics.ListAPIView):
    """
    Api view for getting all posts from administration
    
    - can be developed to get posts from all users
    
    Returns:
        - Response: List of all posts, sorted by date_posted
        
    Endpoint exmaple:
        - /api/user/posts/
    
    Notes: 
       - This view is allowed for all users
    
    """
    permission_classes = [AllowAny]
    queryset = Post.objects.order_by("-date_posted")
    serializer_class = PostSerializer
