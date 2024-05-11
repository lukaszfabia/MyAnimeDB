from django import forms
from .models import Anime, UsersAnime


class AnimeForm(forms.ModelForm):
    """add anime info"""

    class Meta:
        model = Anime
        fields = "__all__"
        widgets = {
            "id_anime": forms.HiddenInput(),
            "type": forms.Select(choices=Anime.ANIME_TYPE),
        }

    def create(self, validated_data):
        anime = Anime.objects.create(**validated_data)
        return anime


class AnimeCollectionForm(forms.ModelForm):
    """add anime collection"""

    class Meta:
        model = UsersAnime
        fields = "__all__"
        widgets = {
            "user": forms.Select(),
            "anime": forms.Select(),
            "status": forms.Select(choices=UsersAnime.ANIME_STATE),
            "score": forms.Select(choices=UsersAnime.SCORE_CHOICES),
            "is_favorite": forms.CheckboxInput(),
        }

    def create(self, validated_data):
        anime = UsersAnime.objects.create(**validated_data)
        return anime


class ReviewsForm(forms.ModelForm):
    """add reviews"""

    class Meta:
        model = UsersAnime
        fields = "__all__"
        widgets = {
            "user": forms.Select(),
            "anime": forms.Select(),
            "review": forms.Textarea(),
        }

    def create(self, validated_data):
        review = UsersAnime.objects.create(**validated_data)
        return review
