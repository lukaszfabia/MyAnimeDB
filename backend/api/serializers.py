from rest_framework import serializers
from api.models import Anime, UserProfile
from django.contrib.auth.models import User

DEFAULT_AVATAR = "avatars/def.png"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = UserProfile
        fields = ["user", "avatar", "bio"]

    def create(self, validated_data):
        user_data = validated_data.pop("user")
        user = UserSerializer().create(user_data)
        avatar = (
            validated_data.get("avatar")
            if validated_data.get("avatar")
            else DEFAULT_AVATAR
        )
        profile = UserProfile.objects.create(
            user=user, avatar=avatar, bio=validated_data.get("bio", "change me")
        )
        return profile


class AnimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Anime
        fields = "__all__"

    def create(self, validated_data):
        anime = Anime.objects.create(**validated_data)
        return anime


# class UserAnimeSerializer(serializers.ModelSerializer):
#     class Meta:
