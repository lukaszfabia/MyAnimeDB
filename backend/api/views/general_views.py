from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny


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
            "route": "user/<str:username>",
            "description": "Get a users info like username.",
        },
        {
            "route": "user/add-anime/<int:id>",
            "description": "Add anime to user or update it if it already exists",
        },
        {
            "route": "user/anime/list/",
            "description": "Get all animes for user",
        },
        {
            "route": "user/fav-anime/<str:username>",
            "description": "Get all favorite animes for user",
        },
        {
            "route": "user/stats/<str:username>",
            "description": "Get user stats like total time spent during watching, fav genre, watched episodes",
        },
        {
            "route": "user/is-fav-anime/<int:id>",
            "description": "Check if anime is on user's favorite list",
        },
        {
            "route": "anime/reviews/<int:id>",
            "description": "Add review to anime or update it if it already exists, get all reviews for anime",
        },
        {
            "route": "user/has-anime/<int:id>",
            "description": "Check if anime is on user's list",
        },
        {
            "route": "anime/score/<int:id>",
            "description": "Compute average score for anime",
        },
        {
            "route": "search/anime/<str:keywords>",
            "description": "Get all animes",
        },
        {
            "route": "anime/props/",
            "description": "Get all genres for anime",
        },
        {
            "route": "anime/<str:title>",
            "description": "Get an anime by title",
        },
    ]

    def get(self, request, *args, **kwargs):
        return Response(self.queryset, status=status.HTTP_200_OK)


class NoPage(generics.GenericAPIView):
    """No page if route does not exist"""

    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"error": "Page not found"}, status=status.HTTP_404_NOT_FOUND)
