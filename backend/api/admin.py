from django.contrib import admin
from .models import *
from .forms import (
    AnimeCollectionForm,
    AnimeForm,
    CreatePostForm,
    GenreForm,
    ReviewsForm,
    CreateCharacterForm,
    CreateVoiceActorForm,
)


@admin.register(Anime)
class AnimeAdmin(admin.ModelAdmin):
    form = AnimeForm
    list_display = ("title", "type", "status")


@admin.register(UsersAnime)
class CollectionAdmin(admin.ModelAdmin):
    form = AnimeCollectionForm


@admin.register(AnimeReviews)
class ReviewsAdmin(admin.ModelAdmin):
    form = ReviewsForm


@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    form = GenreForm
    list_display = ("name",)


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    form = CreatePostForm


@admin.register(Characters)
class CharacterAdmin(admin.ModelAdmin):
    form = CreateCharacterForm


@admin.register(VoiceActor)
class VoiceActorAdmin(admin.ModelAdmin):
    form = CreateVoiceActorForm
