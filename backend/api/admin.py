from django.contrib import admin
from .models import *
from .forms import AnimeCollectionForm, AnimeForm, GenreForm, ReviewsForm


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
