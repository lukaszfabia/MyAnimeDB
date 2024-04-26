from typing import Optional
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from api.serializers import AnimeForm, AnimeSerializer, UserSerializer
from api.models import Anime, UserProfile

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        
        # ...

        return token
    
    
class RegistrationView(APIView):
    def post(self, request):
        user_serializer = UserSerializer(data=request.data)
        if user_serializer.is_valid():
            return user_serializer.create(request.data)
        else:
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class LoginView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
        


@api_view(['GET'])
def get_routes(request):
    routes = [
        'api/token/',
        'api/token/refresh/',
        'api/register/',
        'api/login/',  
        'api/getuser/<str:username>',
        'api/getanime/<int:id>'      
    ]
    
    return Response(routes) 



@api_view(['POST'])
def login(request):
    if request.method == 'POST':
        pass


# dodac walidacje
# @api_view(['POST'])
# def register(request):
#     if request.method == 'POST':
#         serializer = UserSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(
#                 {
#                     "message": "User created successfully",
#                     "username": f"{serializer.data['username']}",
#                 },
#                 status=status.HTTP_201_CREATED
#             )
#         else:
#             return Response(
#                 serializer.errors,
#                 status=status.HTTP_400_BAD_REQUEST
#             )
    
    
    
@api_view(['GET'])
def get_user(request, username):
    try:
        searched_user = UserProfile.objects.get(username=username)
        serializer = UserSerializer(searched_user)
        return Response(serializer.data)
    except UserProfile.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    
@api_view(['GET'])
def get_anime(request, id):
    try:
        anime = Anime.objects.get(id_anime=id)
        serializer = AnimeSerializer(anime)
        return Response(serializer.data)
    except Anime.DoesNotExist:
        return Response({"error": "Anime not found"}, status=status.HTTP_404_NOT_FOUND)