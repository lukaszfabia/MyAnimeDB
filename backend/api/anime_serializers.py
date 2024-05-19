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
