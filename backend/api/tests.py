from django.test import TestCase
from .models import *
from rest_framework.test import APITestCase
from .user_serializers import UserAnimeSerializer, UserSerializer, UserProfileSerializer
from .anime_serializers import (
    AnimeSerializer,
    AnimeReviewSerializer,
)
from django.contrib.auth.models import User


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
class TestUserSerializer(APITestCase):
    def test_user_serializer(self):
        user = User.objects.create(
            username="testuser", password="testpassword", email="tomasz@gmail.com"
        )

        serializer = UserSerializer(user)

        expected_username = f"{serializer.data['username']}"
        expected_email = f"{serializer.data['email']}"
        self.assertEqual(expected_username, "testuser")
        self.assertEqual(expected_email, "tomasz@gmail.com")


class TestUserProfileSerializer(APITestCase):
    def test_user_profile_serializer(self):
        user = User.objects.create(
            username="testuser", password="testpassword", email="tomek@asd.pl"
        )

        profile = UserProfile.objects.create(
            user=user, bio="test bio", avatar="def.png"
        )

        serializer = UserProfileSerializer(profile)

        expected_bio = f"{serializer.data['bio']}"
        expected_avatar = f"{serializer.data['avatar']}"
        expected_username = f"{serializer.data['user']['username']}"
        expected_email = f"{serializer.data['user']['email']}"
        self.assertEqual(expected_bio, "test bio")
        self.assertEqual(expected_avatar, "/media/def.png")
        self.assertEqual(expected_username, "testuser")
        self.assertEqual(expected_email, "tomek@asd.pl")


class TestAnimeSerializer(APITestCase):
    def test_anime_serializer(self):
        genres = {
            Genre.objects.create(name="Action"),
            Genre.objects.create(name="Adventure"),
            Genre.objects.create(name="Comedy"),
        }

        anime = Anime.objects.create(
            title="ABCD",
            type="TV",
            episodes=12,
            status="Not yet aired",
            description="TEST DESCRIPTION",
            duration=24,
            img_url="https://placehold.jp/150x150.png",
        )

        anime.genres.set(genres)

        serializer = AnimeSerializer(anime)

        expected_title = f"{serializer.data['title']}"
        expected_type = f"{serializer.data['type']}"
        expected_episodes = f"{serializer.data['episodes']}"
        expected_status = f"{serializer.data['status']}"
        expected_description = f"{serializer.data['description']}"
        expected_duration = f"{serializer.data['duration']}"
        expected_img_url = f"{serializer.data['img_url']}"
        expected_genres: set[str] = set(serializer.data["genres"])
        self.assertEqual(expected_title, "ABCD")
        self.assertEqual(expected_type, "TV")
        self.assertEqual(expected_episodes, "12")
        self.assertEqual(expected_status, "Not yet aired")
        self.assertEqual(expected_description, "TEST DESCRIPTION")
        self.assertEqual(expected_duration, "24.0")
        genres = set(str(genre) for genre in genres)
        self.assertEqual(expected_genres, genres)
        self.assertEqual(expected_img_url, "https://placehold.jp/150x150.png")


class TestUserAnimeSerializer(APITestCase):
    def test_user_anime_serializer(self):
        user = User.objects.create(
            username="testuser", password="testpassword", email="hehxd@gmail.com"
        )

        profile = UserProfile.objects.create(
            user=user, bio="test bio", avatar="def.png"
        )

        anime = Anime.objects.create(
            title="ABCD",
            type="TV",
            episodes=12,
            status="Not yet aired",
            description="TEST DESCRIPTION",
            duration=24,
            img_url="https://placehold.jp/150x150.png",
        )

        genres = {
            Genre.objects.create(name="Action"),
            Genre.objects.create(name="Adventure"),
            Genre.objects.create(name="Comedy"),
        }

        anime.genres.set(genres)

        profile.save()
        anime.save()

        users_anime = UsersAnime.objects.create(
            user=profile,
            id_anime=anime,
            state="completed",
            score="5",
            is_favorite=True,
        )

        seralizer = UserAnimeSerializer(users_anime)

        expected_user = f"{seralizer.data['user']}"
        expected_anime = f"{seralizer.data['id_anime']['title']}"
        expected_state = f"{seralizer.data['state']}"
        expected_score = f"{seralizer.data['score']}"
        expected_is_favorite = f"{seralizer.data['is_favorite']}"
        self.assertEqual(expected_user, "1")  # users id is taken
        self.assertEqual(expected_anime, "ABCD")
        self.assertEqual(expected_state, "completed")
        self.assertEqual(expected_score, "5")
        self.assertEqual(expected_is_favorite, "True")


class TestAnimeReviewSerializer(APITestCase):
    def test_anime_review_serializer(self):
        user = User.objects.create(
            username="testuser", password="testpassword", email="test@mail.com"
        )

        profile = UserProfile.objects.create(
            user=user, bio="test bio", avatar="def.png"
        )

        anime = Anime.objects.create(
            title="ABCD",
            type="TV",
            episodes=12,
            status="Not yet aired",
            description="TEST DESCRIPTION",
            duration=24,
            img_url="https://placehold.jp/150x150.png",
        )

        genres = {
            Genre.objects.create(name="Action"),
            Genre.objects.create(name="Adventure"),
            Genre.objects.create(name="Comedy"),
        }

        anime.genres.set(genres)

        profile.save()
        anime.save()

        review = AnimeReviews.objects.create(
            user=profile,
            anime=anime,
            review="TEST REVIEW",
        )

        serializer = AnimeReviewSerializer(review)
        print(serializer.data)
        expected_user = f"{serializer.data['user']}"
        expected_anime = f"{serializer.data['anime']}"
        expected_review = f"{serializer.data['review']}"
        self.assertEqual(expected_user, "testuser")
        self.assertEqual(expected_anime, "ABCD")
        self.assertEqual(expected_review, "TEST REVIEW")
