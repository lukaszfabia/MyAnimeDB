from typing import Optional
from rest_framework import serializers
from django.contrib.auth.models import User

from api.anime_serializers import AnimeSerializer
from .models import *


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

    def is_valid_avatar(self, value: Optional[str]) -> bool:
        return value != "" and value is not None

    def create(self, validated_data):
        user_data = validated_data.pop("user")
        user = UserSerializer().create(user_data)
        if self.is_valid_avatar(validated_data.get("avatar")):
            avatar = validated_data.get("avatar")
        else:
            avatar = DEFAULT_AVATAR

        profile = UserProfile.objects.create(
            user=user, avatar=avatar, bio=validated_data.get("bio")
        )
        return profile

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", {})
        user = instance.user
        user.username = user_data.get("username", user.username)
        user.email = user_data.get("email", user.email)

        if "password" in user_data:
            user.set_password(user_data["password"])

        user.save()

        instance.avatar = validated_data.get("avatar", instance.avatar)
        instance.bio = validated_data.get("bio", instance.bio)
        instance.save()

        return instance


class UserAnimeSerializer(serializers.ModelSerializer):
    id_anime = AnimeSerializer(read_only=True)

    class Meta:
        model = UsersAnime
        fields = "__all__"

    def create(self, validated_data):
        users_anime = UsersAnime.objects.create(**validated_data)
        return users_anime

    def update(self, instance, validated_data):
        print(__name__ + " update")
        instance.id_anime = validated_data.get("id_anime", instance.id_anime)
        instance.user = validated_data.get("user", instance.user)
        instance.state = validated_data.get("state", instance.state)
        instance.score = validated_data.get("score", instance.score)
        instance.is_favorite = validated_data.get("is_favorite", instance.is_favorite)
        instance.save()
        return instance


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = "__all__"

    def create(self, validated_data):
        post = Post.objects.create(**validated_data)
        return post

    def update(self, instance, validated_data):
        instance.title = validated_data.get("title", instance.title)
        instance.content = validated_data.get("content", instance.content)
        instance.save()
        return instance
