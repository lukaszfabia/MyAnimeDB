from django.contrib import admin


from .models import UserProfile, Anime, UsersAnime
from django.contrib import admin
from .forms import AnimeCollectionForm, AnimeForm


@admin.register(Anime)
class AnimeAdmin(admin.ModelAdmin):
    form = AnimeForm


@admin.register(UsersAnime)
class CollectionAdmin(admin.ModelAdmin):
    """to development purposes only"""

    form = AnimeCollectionForm
