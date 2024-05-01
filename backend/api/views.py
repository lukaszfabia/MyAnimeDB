import json
import jwt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from api.serializers import AnimeSerializer, UserProfileSerializer

from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, JSONParser
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework.decorators import permission_classes

from api.models import Anime, UserProfile
from backend import settings


class RegistrationView(CreateAPIView):
    serializer_class = UserProfileSerializer
    queryset = UserProfile.objects.all()
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, JSONParser]

    def post(self, request, *args, **kwargs):
        print(request.data)
        fixed_data = request.data.copy()
        if fixed_data["avatar"] == "" or fixed_data["avatar"] == "undefined":
            fixed_data["avatar"] = None

        serializer = self.serializer_class(data=fixed_data)
        print(request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": "User registered successfully",
                    "data": serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetRoutesView(APIView):
    """Main view to all routes in the API"""

    permission_classes = [AllowAny]

    def get(self, request):
        routes = [
            {"route": "api/token/", "description": "Get JWT token"},
            {"route": "api/token/refresh/", "description": "Refresh JWT token"},
            {"route": "api/register/", "description": "Register a user"},
            {
                "route": "api/user/<str:username>",
                "description": "Get a users info like username, email, bio, avatar, ...",
            },
            {
                "route": "api/anime/<str:title>",
                "description": "Get an anime by title",
            },
            {"route": "api/user-data/", "description": "Get user data"},
        ]

        return Response(routes)


class UserDataView(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        auth_header = request.headers.get("Authorization")
        token = auth_header.replace("Bearer ", "") if auth_header else ""
        try:
            UntypedToken(token)
        except (InvalidToken, TokenError) as e:
            print("token byl zl")
            raise InvalidToken("Unable to decode token") from e

        id = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"]).get("user_id")

        try:
            user = UserProfile.objects.get(user__id=id)
            serializer = UserProfileSerializer(user)
            return Response(
                serializer.data,
                status=status.HTTP_200_OK,
            )
        except UserProfile.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )


class SettingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"msg": "get method"})

    def put(self, request):
        return Response({"msg": "put method "})


#### endpoints with getting data


@api_view(["GET"])
def get_anime_by_title(request, title):
    animes = Anime.objects.filter(title__contains=title)
    if not animes:
        return Response(
            {"error": f"not found any of them with {title}"}, status.HTTP_404_NOT_FOUND
        )
    serializers = AnimeSerializer(animes, many=True)
    return Response(serializers.data, status.HTTP_200_OK)


@api_view(["GET"])
def get_user_by_id(request, id):
    try:
        searched_user = UserProfile.objects.get(user__id=id)
        serializer = UserProfileSerializer(searched_user)
        return Response(serializer.data)
    except UserProfile.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(["GET"])
def get_user(request, username):
    try:
        user = UserProfile.objects.get(user__username=username)
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)
    except UserProfile.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


#### endpoints with adding data


# class AddAnimeView(CreateAPIView):
#     serializer_class = UserAnimeSerializer


# @api_view(['GET'])
# def get_anime(request, id):
#     try:
#         anime = Anime.objects.get(id_anime=id)
#         serializer = AnimeSerializer(anime)
#         return Response(serializer.data)
#     except Anime.DoesNotExist:
#         return Response({"error": "Anime not found"}, status=status.HTTP_404_NOT_FOUND)
