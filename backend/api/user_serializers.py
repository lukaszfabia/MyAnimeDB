from typing import Optional
from rest_framework import serializers
from django.contrib.auth.models import User

from api.anime_serializers import AnimeSerializer
from .models import *


DEFAULT_AVATAR = "avatars/def.png"


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer class for the User model.

    This serializer is used to convert User model instances to JSON
    and vice versa. It defines the fields that should be included in
    the serialized representation of a User object.

    Attributes:
        model (User): The User model class.
        fields (list): The fields to include in the serialized representation.
        extra_kwargs (dict): Additional keyword arguments for field options.

    Methods:
        create(validated_data): Create a new User instance.

    """

    class Meta:
        model = User
        fields = ["username", "email", "password", "is_staff"]
        extra_kwargs = {
            "password": {"write_only": True},
            "is_staff": {"read_only": True},
        }

    def create(self, validated_data):
        """
        Create a new User instance.

        This method is called when a new User object is being created.
        It takes the validated data and creates a new User instance
        using the `create_user` method of the User model.

        Args:
            validated_data (dict): The validated data for creating the User.

        Returns:
            User: The newly created User instance.

        """
        user = User.objects.create_user(**validated_data)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for the UserProfile model.

    This serializer is used to serialize and deserialize UserProfile objects.
    It includes the user's avatar and bio fields, as well as the nested UserSerializer.

    Attributes:
        user (UserSerializer): Serializer for the nested User model.
    """

    user = UserSerializer()

    class Meta:
        model = UserProfile
        fields = ["user", "avatar", "bio"]

    def is_valid_avatar(self, value: Optional[str]) -> bool:
        """
        Check if the avatar value is valid.

        Args:
            value (str): The avatar value to be checked.

        Returns:
            bool: True if the avatar value is valid, False otherwise.
        """
        return value != "" and value is not None

    def create(self, validated_data):
        """
        Create a new UserProfile instance.

        Args:
            validated_data (dict): The validated data for creating the UserProfile.

        Returns:
            UserProfile: The created UserProfile instance.
        """
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
        """
        Update an existing UserProfile instance.

        Args:
            instance (UserProfile): The UserProfile instance to be updated.
            validated_data (dict): The validated data for updating the UserProfile.

        Returns:
            UserProfile: The updated UserProfile instance.
        """
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
    """
    Serializer for the UsersAnime model.
    """

    id_anime = AnimeSerializer(read_only=True)

    class Meta:
        model = UsersAnime
        fields = "__all__"

    def create(self, validated_data):
        """
        Create a new UsersAnime instance.

        Args:
            validated_data (dict): Validated data for creating the instance.

        Returns:
            UsersAnime: The created UsersAnime instance.
        """
        users_anime = UsersAnime.objects.create(**validated_data)
        return users_anime

    def update(self, instance, validated_data):
        """
        Update an existing UsersAnime instance.

        Args:
            instance (UsersAnime): The existing UsersAnime instance to update.
            validated_data (dict): Validated data for updating the instance.

        Returns:
            UsersAnime: The updated UsersAnime instance.
        """
        print(__name__ + " update")
        instance.id_anime = validated_data.get("id_anime", instance.id_anime)
        instance.user = validated_data.get("user", instance.user)
        instance.state = validated_data.get("state", instance.state)
        instance.score = validated_data.get("score", instance.score)
        instance.is_favorite = validated_data.get("is_favorite", instance.is_favorite)
        instance.save()
        return instance


class PostSerializer(serializers.ModelSerializer):
    """
    Serializer class for the Post model.
    """

    class Meta:
        model = Post
        fields = "__all__"

    def create(self, validated_data):
        """
        Create a new Post instance with the provided validated data.

        Args:
            validated_data (dict): The validated data for creating the Post.

        Returns:
            Post: The created Post instance.
        """
        post = Post.objects.create(**validated_data)
        return post

    def update(self, instance, validated_data):
        """
        Update an existing Post instance with the provided validated data.

        Args:
            instance (Post): The existing Post instance to be updated.
            validated_data (dict): The validated data for updating the Post.

        Returns:
            Post: The updated Post instance.
        """
        instance.title = validated_data.get("title", instance.title)
        instance.content = validated_data.get("content", instance.content)
        instance.save()
        return instance
