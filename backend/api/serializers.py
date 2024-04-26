from typing import Optional
from rest_framework.response import Response
from rest_framework import serializers, status
from api.models import UserProfile, Anime    
from django import forms

DEFAULT_AVATAR = "avatars/def.png"

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['username', 'email', 'password', 'avatar', 'bio']
        extra_kwargs = {'password': {'write_only': True}}
        

    def create(self, data):
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        avatar: str = data.get('avatar') if data.get('avatar') else DEFAULT_AVATAR
        
        if not username or not email or not password:
            return Response(
                {"error": "Please provide username, email and password"},
                status=status.HTTP_400_BAD_REQUEST
            )
        elif UserProfile.objects.filter(username=username).exists():
            return Response(
                {"error": "Username already taken"},
                status=status.HTTP_400_BAD_REQUEST
            )
        else:
            new_user = UserProfile.objects.create(
                username=username,
                email=email,
                avatar=avatar,
                password=password   
            )
            return Response(
                {
                    "message": "User created successfully",
                    "username": f"{new_user.username}",
                },
                status=status.HTTP_201_CREATED
            )
    
    
class AnimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Anime
        fields = '__all__'
        
    def create(self, validated_data):
        anime = Anime.objects.create(**validated_data)
        return anime


class AnimeForm(forms.ModelForm):
    class Meta:
        model = Anime
        fields = '__all__'
        widgets = {
            'id_anime': forms.HiddenInput(),
            'type': forms.Select(choices=Anime.ANIME_TYPE),
        }


    def create(self, validated_data):
        anime = Anime.objects.create(**validated_data)
        return anime