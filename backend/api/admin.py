from django.contrib import admin

from api.serializers import AnimeForm

from .models import UserProfile, Anime
from django.contrib import admin
from .models import UserProfile, Anime

#dashboard admina

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'avatar', 'bio']  # Display selected fields in the admin panel

@admin.register(Anime)
class AnimeAdmin(admin.ModelAdmin):
    form = AnimeForm