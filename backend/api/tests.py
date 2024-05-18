from django.test import TestCase
from .models import *
from rest_framework.test import APITestCase
from .serializers import UserAnimeSerializer

# Create your tests here.

########################
# Test Models
########################


class TestUserProfile(TestCase):
    @classmethod
    def setUpTestData(cls) -> None:
        user = User.objects.create(
            username="testuser", password="testpassword", email="test@gmail.com"
        )
        UserProfile.objects.create(user=user, bio="test bio")

    def test_user_profile(self):
        user_profile = UserProfile.objects.get(id=1)
        user = User.objects.get(id=1)
        expected_username = f"{user.username}"
        expected_password = f"{user.password}"
        expected_email = f"{user.email}"
        expected_bio = f"{user_profile.bio}"
        expected_avatar = f"{user_profile.avatar}"
        self.assertEqual(expected_username, "testuser")
        self.assertEqual(expected_bio, "test bio")
        self.assertEqual(expected_email, "test@gmail.com")
        self.assertEqual(expected_avatar, "")
        self.assertEqual(expected_password, "testpassword")


class TestAnime(TestCase):

    @classmethod
    def setUpTestData(cls) -> None:
        genres = {
            Genre.objects.create(name="Action"),
            Genre.objects.create(name="Adventure"),
            Genre.objects.create(name="Comedy"),
            Genre.objects.create(name="Super Power"),
            Genre.objects.create(name="Martial Arts"),
            Genre.objects.create(name="Shounen"),
        }

        anime = Anime.objects.create(
            title="Naruto",
            type="TV",
            episodes=220,
            status="Finished Airing",
            description="TEST DESCRIPTION",
            duration=24,
            img_url="https://placehold.jp/150x150.png",
        )

        anime.genres.set(genres)

    def test_anime(self) -> None:
        anime = Anime.objects.get(id_anime=1)
        genres = {
            Genre.objects.get(name="Action"),
            Genre.objects.get(name="Adventure"),
            Genre.objects.get(name="Comedy"),
            Genre.objects.get(name="Super Power"),
            Genre.objects.get(name="Martial Arts"),
            Genre.objects.get(name="Shounen"),
        }
        expected_title = f"{anime.title}"
        expected_type = f"{anime.type}"
        expected_episodes = f"{anime.episodes}"
        expected_status = f"{anime.status}"
        expected_description = f"{anime.description}"
        expected_duration = f"{anime.duration}"
        expected_img_url = f"{anime.img_url}"
        expected_genres = set(anime.genres.all())
        self.assertEqual(expected_title, "Naruto")
        self.assertEqual(expected_type, "TV")
        self.assertEqual(expected_episodes, "220")
        self.assertEqual(expected_status, "Finished Airing")
        self.assertEqual(expected_description, "TEST DESCRIPTION")
        self.assertEqual(expected_duration, "24.0")
        self.assertEqual(expected_img_url, "https://placehold.jp/150x150.png")
        self.assertEqual(expected_genres, genres)


class TestAnimeGenres(TestCase):

    @classmethod
    def setUpTestData(cls) -> None:
        genre = Genre.objects.create(name="Action")
        anime = Anime.objects.create(
            title="Naruto",
            type="TV",
            episodes=220,
            status="Finished Airing",
            description="TEST DESCRIPTION",
            duration=24,
            img_url="https://placehold.jp/150x150.png",
        )
        AnimeGenres.objects.create(anime=anime, genre=genre)

    def test_anime_genres(self) -> None:
        anime_genre = AnimeGenres.objects.get(id_anime_genre=1)
        expected_anime = f"{anime_genre.anime}"
        expected_genre = f"{anime_genre.genre}"
        self.assertEqual(expected_anime, "Naruto")
        self.assertEqual(expected_genre, "Action")


class TestReview(TestCase):

    @classmethod
    def setUpTestData(cls) -> None:
        user = User.objects.create(
            username="testuser", password="testpassword", email="example@mail.com"
        )

        profile = UserProfile(user=user, bio="test bio")

        anime = Anime.objects.create(
            title="Naruto",
            type="TV",
            episodes=220,
            status="Finished Airing",
            description="TEST DESCRIPTION",
            duration=24,
            img_url="https://placehold.jp/150x150.png",
        )

        anime.save()
        profile.save()

        review = AnimeReviews.objects.create(
            user=profile,
            anime=anime,
            review="TEST REVIEW",
        )

        review.save()

    def test_review(self) -> None:
        review = AnimeReviews.objects.get(id_review=1)
        expected_user = f"{review.user}"
        expected_anime = f"{review.anime}"
        expected_review = f"{review.review}"
        self.assertEqual(expected_user, "testuser")
        self.assertEqual(expected_anime, "Naruto")
        self.assertEqual(expected_review, "TEST REVIEW")


class TestUsersAnime(TestCase):

    @classmethod
    def setUpTestData(cls) -> None:
        user = User.objects.create(
            username="testuser", password="testpassword", email="example@inter.pl"
        )

        profile = UserProfile(user=user, bio="test bio")

        profile.save()

        anime = Anime.objects.create(
            title="Attack on Titan",
            type="TV",
            episodes=120,
            status="Finished Airing",
            description="I HATE MAPPA",
            duration=23,
            img_url="https://placehold.jp/150x150.png",
        )

        anime.save()

        users_anime = UsersAnime.objects.create(
            user=profile,
            id_anime=anime,
            state="completed",
            score="5",
            is_favorite=True,
        )

        users_anime.save()

    def test_users_anime(self) -> None:
        users_anime = UsersAnime.objects.get(id=1)
        expected_user = f"{users_anime.user}"
        expected_anime = f"{users_anime.id_anime.title}"
        expected_state = f"{users_anime.state}"
        expected_score = f"{users_anime.score}"
        expected_is_favorite = f"{users_anime.is_favorite}"
        self.assertEqual(expected_user, "testuser")
        self.assertEqual(expected_anime, "Attack on Titan")
        self.assertEqual(expected_state, "completed")
        self.assertEqual(expected_score, "5")
        self.assertEqual(expected_is_favorite, "True")


########################
# Test Serializers
########################
