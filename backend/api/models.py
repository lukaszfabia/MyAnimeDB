from django.db import models
from django.contrib.auth.models import User
from pathlib import Path


class UserProfile(models.Model):
    id_user = models.AutoField(primary_key=True)
    username = models.CharField(max_length=45)
    email = models.EmailField(max_length=45)
    password = models.CharField(max_length=50)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    bio = models.TextField("Biography", max_length=200, default="change me")
    
    def __str__(self):
        return f'{self.username}s profile'
    
class Genre(models.Model):
    GENRE = [
        ('Action', 'Action'), ('Comedy', 'Comedy'),
        ('Drama', 'Drama'), ('Fantasy', 'Fantasy'),
        ('Horror', 'Horror'), ('Mecha', 'Mecha'),
        ('Mystery', 'Mystery'), ('Romance', 'Romance'),
        ('Sci-Fi', 'Sci-Fi'), ('Slice of Life', 'Slice of Life'),
        ('Sports', 'Sports'), ('Supernatural', 'Supernatural'),
        ('Thriller', 'Thriller'), ('Psychological', 'Psychological'),
        ('Adventure', 'Adventure'), ('Historical', 'Historical'),
        ('Magic', 'Magic'), ('Military', 'Military'),
        ('Music', 'Music'), ('Parody', 'Parody'),
        ('School', 'School'), ('Shoujo', 'Shoujo'),
        ('Shounen', 'Shounen'), ('Space', 'Space'),
        ('Super Power', 'Super Power'), ('Vampire', 'Vampire'),
        ('Yaoi', 'Yaoi'), ('Yuri', 'Yuri'),
        ('Harem', 'Harem'), ('Josei', 'Josei'),
        ('Demons', 'Demons'), ('Game', 'Game'),
        ('Police', 'Police'), ('Samurai', 'Samurai'),
        ('Seinen', 'Seinen'), ('Shoujo Ai', 'Shoujo Ai'),
        ('Shounen Ai', 'Shounen Ai'), ('Kids', 'Kids'),    
    ]
    id_genre = models.AutoField(primary_key=True)
    name = models.CharField(max_length=20, choices=GENRE)
    
    def __str__(self):
        return self.name
    
    
class Anime(models.Model):
    ANIME_TYPE = [
        ('TV', 'TV'), ('OVA', 'OVA'),
        ('Movie', 'Movie'), ('Special', 'Special'),
        ('ONA', 'ONA'), ('Music', 'Music'),
    ]
    
    ANIME_STATUS = [
        ('Finished Airing', 'Finished Airing'), ('Currently Airing', 'Currently Airing'),
        ('Not yet aired', 'Not yet aired')
    ]
    
    id_anime = models.AutoField(primary_key=True)
    type = models.CharField(max_length=10, choices=ANIME_TYPE)
    title = models.CharField(max_length=100)
    alternative_title = models.CharField(max_length=200)
    score = models.FloatField()
    ranked = models.IntegerField()
    popularity = models.IntegerField()
    status = models.CharField(max_length=30, choices=ANIME_STATUS)
    description = models.TextField()
    img_url = models.URLField()
    
    def __str__(self):
        return self.title
    
class AnimeGenres(models.Model):
    id_anime_genre = models.AutoField(primary_key=True)
    anime = models.ForeignKey(Anime, on_delete=models.CASCADE)
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE)
    
    def __str__(self):
        return f'{self.anime} is {self.genre}'
    
class UsersAnime(models.Model):
    ANIME_STATE = [
        ('Watching', 'Watching'), ('Completed', 'Completed'), ('On-Hold', 'On-Hold'),
        ('Dropped', 'Dropped'), ('Plan to Watch', 'Plan to Watch')
    ]
    
    SCORE_CHOICES = [
        ('1', '1'), ('2', '2'), ('3', '3'), ('4', '4'), ('5', '5'), ('6', '6')
    ]
    
    id_anime = models.ForeignKey(Anime, on_delete=models.CASCADE)
    id_user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    
    state = models.CharField(max_length=20, choices=ANIME_STATE)
    score = models.CharField(max_length=1, choices=SCORE_CHOICES)
    is_favorite = models.BooleanField(default=False)
