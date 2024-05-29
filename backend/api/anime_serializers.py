from rest_framework import serializers
from .models import *


class AnimeSerializer(serializers.ModelSerializer):
    genres = serializers.StringRelatedField(many=True)

    class Meta:
        model = Anime
        fields = "__all__"

    def create(self, validated_data):
        anime = Anime.objects.create(**validated_data)
        return anime


class AnimeReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    anime = serializers.StringRelatedField()

    class Meta:
        model = AnimeReviews
        fields = "__all__"

    def create(self, validated_data):
        review = AnimeReviews.objects.create(**validated_data)
        return review

    def update(self, instance, validated_data):
        instance.user = validated_data.get("user", instance.user)
        instance.anime = validated_data.get("anime", instance.anime)
        instance.review = validated_data.get("review", instance.review)
        instance.save()
        return instance


class CharacterSerializer(serializers.ModelSerializer):
    anime = serializers.StringRelatedField(many=True)
    voice_actors = serializers.StringRelatedField(many=True)

    class Meta:
        model = Characters
        fields = "__all__"

    def create(self, validated_data):
        character = Characters.objects.create(**validated_data)
        return character


class VoiceActorSerializer(serializers.Serializer):

    class Meta:
        model = VoiceActor
        fields = "__all__"

    def create(self, validated_data):
        voice_actor = VoiceActor.objects.create(**validated_data)
        return voice_actor

    def update(self, instance, validated_data):
        instance.name = validated_data.get("name", instance.name)
        instance.anime = validated_data.get("anime", instance.anime)
        instance.description = validated_data.get("description", instance.description)
        instance.img = validated_data.get("img", instance.img)
        instance.save()
        return instance
