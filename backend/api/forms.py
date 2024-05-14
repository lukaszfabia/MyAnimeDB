from typing import Any
from django import forms
from .models import Anime, Genre, UsersAnime


class AnimeForm(forms.ModelForm):
    genres = forms.ModelMultipleChoiceField(
        queryset=Genre.objects.all(), widget=forms.CheckboxSelectMultiple, required=True
    )

    class Meta:
        model = Anime
        fields = "__all__"

    # def save(self, commit=False) -> Any:
    #     anime = super().save(commit=False)
    #     anime.save()
    #     self.save_m2m()
    #     return anime


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


class GenreForm(forms.ModelForm):
    class Meta:
        model = Genre  # Upewnij się, że model Genre istnieje
        fields = ["name"]  # Zastąp 'name' polami, które chcesz uwzględnić w formularzu
