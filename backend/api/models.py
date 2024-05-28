from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    """represents a user profile
    * user - the user that owns the profile (User)
    * avatar - the user's profile picture (ImageField)
    * bio - the user's biography (str)
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    bio = models.TextField(
        "Biography", max_length=200, default="change me", null=True, blank=True
    )

    @property
    def get_username(self):
        return self.user.username

    def __str__(self):
        return str(self.user.username)


class Genre(models.Model):
    """represents a genre of anime
    * name - the name of the genre (str)
    """

    GENRE = [
        ("Action", "Action"),
        ("Comedy", "Comedy"),
        ("Drama", "Drama"),
        ("Fantasy", "Fantasy"),
        ("Horror", "Horror"),
        ("Mecha", "Mecha"),
        ("Mystery", "Mystery"),
        ("Romance", "Romance"),
        ("Sci-Fi", "Sci-Fi"),
        ("Slice of Life", "Slice of Life"),
        ("Sports", "Sports"),
        ("Supernatural", "Supernatural"),
        ("Thriller", "Thriller"),
        ("Psychological", "Psychological"),
        ("Adventure", "Adventure"),
        ("Historical", "Historical"),
        ("Magic", "Magic"),
        ("Military", "Military"),
        ("Music", "Music"),
        ("Parody", "Parody"),
        ("School", "School"),
        ("Shoujo", "Shoujo"),
        ("Shounen", "Shounen"),
        ("Space", "Space"),
        ("Super Power", "Super Power"),
        ("Vampire", "Vampire"),
        ("Yaoi", "Yaoi"),
        ("Yuri", "Yuri"),
        ("Harem", "Harem"),
        ("Josei", "Josei"),
        ("Demons", "Demons"),
        ("Game", "Game"),
        ("Police", "Police"),
        ("Samurai", "Samurai"),
        ("Seinen", "Seinen"),
        ("Shoujo Ai", "Shoujo Ai"),
        ("Shounen Ai", "Shounen Ai"),
        ("Kids", "Kids"),
    ]
    id_genre = models.AutoField(primary_key=True)
    name = models.CharField(max_length=20, choices=GENRE)

    def __str__(self):
        return self.name


class Anime(models.Model):
    ANIME_TYPE = [
        ("TV", "TV"),
        ("OVA", "OVA"),
        ("Movie", "Movie"),
        ("Special", "Special"),
        ("ONA", "ONA"),
        ("Music", "Music"),
    ]

    ANIME_STATUS = [
        ("Finished Airing", "Finished Airing"),
        ("Currently Airing", "Currently Airing"),
        ("Not yet aired", "Not yet aired"),
    ]

    id_anime = models.AutoField(primary_key=True)
    type = models.CharField(max_length=10, choices=ANIME_TYPE)
    title = models.CharField(max_length=100)
    alternative_title = models.CharField(max_length=200)
    status = models.CharField(max_length=30, choices=ANIME_STATUS)
    description = models.TextField()
    img_url = models.URLField()
    duration = models.FloatField(null=True)
    episodes = models.IntegerField(null=True)
    rating = models.FloatField(null=True, default=0.0)
    genres = models.ManyToManyField(Genre, through="AnimeGenres")
    popularity = models.IntegerField(default=0)

    def __str__(self):
        return self.title


class AnimeGenres(models.Model):
    id_anime_genre = models.AutoField(primary_key=True)
    anime = models.ForeignKey(Anime, on_delete=models.CASCADE)
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.genre}"


class UsersAnime(models.Model):
    """represents an anime in a user's list
    * id_anime - the anime that the user has (Anime)
    * user - the user that has the anime (UserProfile)
    * state - the state of the anime in the user's list (str)
    * score - the score that the user gave to the anime (str)
    * is_favorite - whether the anime is a favorite of the user (bool)
    """

    ANIME_STATE = [
        ("watching", "Watching"),
        ("completed", "Completed"),
        ("on-hold", "On-Hold"),
        ("dropped", "Dropped"),
        ("plan-to-watch", "Plan to Watch"),
    ]

    SCORE_CHOICES = [
        ("0", "None"),
        ("1", "Bad"),
        ("2", "Boring"),
        ("3", "Ok"),
        ("4", "Very good"),
        ("5", "Excellent"),
        ("6", "Masterpiece"),
    ]

    id_anime = models.ForeignKey(
        Anime, on_delete=models.CASCADE
    )  # there should be anime not id anime
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)

    state = models.CharField(max_length=20, choices=ANIME_STATE, default="watching")
    score = models.CharField(max_length=20, choices=SCORE_CHOICES, default="0")
    is_favorite = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user} is {self.state} {self.id_anime}"


class AnimeReviews(models.Model):
    """represents a review of an anime
    * user - the user that wrote the review (UserProfile)
    * anime - the anime that the review is about (Anime)
    * review - the review itself (str)
    """

    id_review = models.AutoField(primary_key=True)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    anime = models.ForeignKey(Anime, on_delete=models.CASCADE)
    review = models.TextField(max_length=1000)

    def __str__(self):
        return f"{self.anime} review by {self.user}"


class Post(models.Model):
    """represents a post
    * user - the user (staff only) that wrote the post
    * title - the title of the post (str)
    * content - the content of the post (str)
    * date_posted - the date the post was posted (DateTime)
    """

    id_post = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        UserProfile, on_delete=models.CASCADE, limit_choices_to={"user__is_staff": True}
    )
    title = models.CharField(max_length=100)
    content = models.TextField()
    date_posted = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
