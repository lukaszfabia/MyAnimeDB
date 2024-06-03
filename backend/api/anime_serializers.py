from rest_framework import serializers
from .models import *


class AnimeSerializer(serializers.ModelSerializer):
    """
    Serializer class for the Anime model.

    Serializes and deserializes Anime objects to and from JSON format.
    """

    genres = serializers.StringRelatedField(many=True)

    class Meta:
        model = Anime
        fields = "__all__"

    def create(self, validated_data):
        """
        Create and return a new Anime instance.

        Args:
            validated_data (dict): The validated data for creating the Anime instance.

        Returns:
            Anime: The created Anime instance.
        """
        anime = Anime.objects.create(**validated_data)
        return anime


class AnimeReviewSerializer(serializers.ModelSerializer):
    """
    Serializer class for AnimeReviews model.
    """

    user = serializers.StringRelatedField()
    anime = serializers.StringRelatedField()

    class Meta:
        model = AnimeReviews
        fields = "__all__"

    def create(self, validated_data):
        """
        Create a new AnimeReview instance.

        Args:
            validated_data (dict): Validated data for creating the AnimeReview.

        Returns:
            AnimeReviews: The created AnimeReview instance.
        """
        review = AnimeReviews.objects.create(**validated_data)
        return review

    def update(self, instance, validated_data):
        """
        Update an existing AnimeReview instance.

        Args:
            instance (AnimeReviews): The existing AnimeReview instance to be updated.
            validated_data (dict): Validated data for updating the AnimeReview.

        Returns:
            AnimeReviews: The updated AnimeReview instance.
        """
        instance.user = validated_data.get("user", instance.user)
        instance.anime = validated_data.get("anime", instance.anime)
        instance.review = validated_data.get("review", instance.review)
        instance.save()
        return instance


class CharacterSerializer(serializers.ModelSerializer):
    """
    Serializer class for the Character model.
    """

    anime = serializers.StringRelatedField(many=True)
    voice_actors = serializers.StringRelatedField(many=True)

    class Meta:
        model = Characters
        fields = "__all__"

    def create(self, validated_data):
        """
        Create and return a new Character instance.

        Args:
            validated_data (dict): Validated data for creating the Character.

        Returns:
            Character: The created Character instance.
        """
        character = Characters.objects.create(**validated_data)
        return character


class VoiceActorSerializer(serializers.Serializer):
    """
    Serializer for the VoiceActor model.
    """

    class Meta:
        model = VoiceActor
        fields = "__all__"

    def create(self, validated_data):
        """
        Create and return a new VoiceActor instance.

        Args:
            validated_data (dict): Validated data for creating the VoiceActor.

        Returns:
            VoiceActor: The created VoiceActor instance.
        """
        voice_actor = VoiceActor.objects.create(**validated_data)
        return voice_actor

    def update(self, instance, validated_data):
        """
        Update and return an existing VoiceActor instance.

        Args:
            instance (VoiceActor): The existing VoiceActor instance to be updated.
            validated_data (dict): Validated data for updating the VoiceActor.

        Returns:
            VoiceActor: The updated VoiceActor instance.
        """
        instance.name = validated_data.get("name", instance.name)
        instance.anime = validated_data.get("anime", instance.anime)
        instance.description = validated_data.get("description", instance.description)
        instance.img = validated_data.get("img", instance.img)
        instance.save()
        return instance
