from typing import Dict, List
from api.models import Anime, AnimeGenres, UsersAnime


class AnalyseAnime:

    @staticmethod
    def compute_avg_rating(animes: List[Anime]) -> float:
        """get the average rating of a list of animes"""
        if len(animes) == 0:
            return 0.0

        non_zero_scores = sum(1 for anime in animes if float(anime.score) != 0)
        if non_zero_scores == 0:
            return 0.0

        return round(
            sum([(float(anime.score)) for anime in animes]) / non_zero_scores, 1
        )

    @staticmethod
    def fix_popularity(title: str) -> int:
        """gets the popularity of an anime

        Args:
            title (str): title of the anime

        Returns:
            int: fixed popularity of the anime
        Example:
            lets assume that Anime "A" has a popularity equal to 3 it means that this anime is on the 3 lists of users anime
            so to fix it we should return sorted dict with occurrences of each anime and get the index of the anime in the sorted dict,
            so if "A" is the only anime in the list it should return 1
        """
        animes = Anime.objects.order_by("-popularity").all()
        fixed_popularity: Dict[str, int] = dict()
        for index, anime in enumerate(animes):
            fixed_popularity[anime.title] = index + 1

        return fixed_popularity.get(title, 0)


class AnalyseData:
    """computes fav genres, total time spent during watching, watched episodes"""

    def __init__(self, username: str) -> None:
        self.username = username
        self.animes: List[Anime] = UsersAnime.objects.filter(
            user__user__username=self.username
        )

    def is_completed(self, elem: Anime) -> bool:
        """check if the anime is completed

        Args:
            elem (Anime): Anime object to check

        Returns:
            bool: is completed or not
        """
        return (
            UsersAnime.objects.get(
                id_anime=elem.id_anime, user__user__username=self.username
            ).state.lower()
            == "completed"
            and elem.id_anime.episodes
            and elem.id_anime.duration
        )

    def get_total_time(self) -> int:
        """computes the total time spent during watching

        Returns:
            int: total time in minutes
        """
        total_time: int = sum(
            [
                elem.id_anime.duration * elem.id_anime.episodes
                for elem in self.animes
                if self.is_completed(elem)
            ]
        )

        return total_time

    def get_watched_episodes(self) -> int:
        """sums the watched episodes"""
        return sum(
            [elem.id_anime.episodes for elem in self.animes if self.is_completed(elem)]
        )

    def get_fav_genre(self) -> List[str]:
        """get the most watched genre

        Returns:
            List[str]: genres as a list, it can be list cuz there can be multiple genres with the same number of occurrences
        """
        genres: Dict[str, int] = dict()
        for elem in self.animes:
            for genre in AnimeGenres.objects.filter(anime=elem.id_anime):
                if genre.genre.name in genres:
                    genres[genre.genre.name] += 1
                else:
                    genres[genre.genre.name] = 1

        res: List[str] = list()
        for key, value in genres.items():
            if value == max(genres.values()):
                res.append(key)

        return res
