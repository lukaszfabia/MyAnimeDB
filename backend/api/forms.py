from django import forms
from .models import *


class AnimeForm(forms.ModelForm):
    genres = forms.ModelMultipleChoiceField(
        queryset=Genre.objects.all(), widget=forms.CheckboxSelectMultiple, required=True
    )

    class Meta:
        model = Anime
        fields = "__all__"


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
        model = Genre
        fields = ["name"]


class CreatePostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = "__all__"
        widgets = {
            "user": forms.Select(),
            "title": forms.TextInput(),
            "content": forms.Textarea(),
        }

    def create(self, validated_data):
        post = Post.objects.create(**validated_data)
        return post


class CreateCharacterForm(forms.ModelForm):
    class Meta:
        model = Characters
        fields = "__all__"
        widgets = {
            "img": forms.FileInput(attrs={"accept": "image/*"}),
        }


class CreateVoiceActorForm(forms.ModelForm):
    class Meta:
        model = VoiceActor
        fields = "__all__"
        widgets = {
            "img": forms.FileInput(attrs={"accept": "image/*"}),
        }
