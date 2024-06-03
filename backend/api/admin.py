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
    """creating new anime"""

    form = AnimeForm
    list_display = ("title", "type", "status")


@admin.register(UsersAnime)
class CollectionAdmin(admin.ModelAdmin):
    """edit collection"""

    form = AnimeCollectionForm


@admin.register(AnimeReviews)
class ReviewsAdmin(admin.ModelAdmin):
    """create review from backend"""

    form = ReviewsForm


@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    """register new genre"""

    form = GenreForm
    list_display = ("name",)


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    """form to creating post"""

    form = CreatePostForm


@admin.register(Characters)
class CharacterAdmin(admin.ModelAdmin):
    """form to creating new characters"""

    form = CreateCharacterForm


@admin.register(VoiceActor)
class VoiceActorAdmin(admin.ModelAdmin):
    """form to creating voice actor"""

    form = CreateVoiceActorForm
