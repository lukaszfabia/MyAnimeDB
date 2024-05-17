from typing import Dict, List
from api.models import Anime, AnimeGenres, UsersAnime


class AnalyseData:
    """computes fav genres, total time spent during watching, watched episodes"""

    def __init__(self, username: str):
        self.username = username
        self.animes: List[Anime] = UsersAnime.objects.filter(
            user__user__username=self.username
        )

    def is_watched(self, elem: Anime) -> bool:
        return (
            UsersAnime.objects.get(
                id_anime=elem.id_anime, user__user__username=self.username
            ).state.lower()
            == "completed"
            and elem.id_anime.episodes
            and elem.id_anime.duration
        )

    def get_total_time(self) -> int:
        total_time: int = sum(
            [
                elem.id_anime.duration * elem.id_anime.episodes
                for elem in self.animes
                if self.is_watched(elem)
            ]
        )

        print(total_time)
        return total_time

    def get_watched_episodes(self) -> int:
        return sum(
            [elem.id_anime.episodes for elem in self.animes if self.is_watched(elem)]
        )

    def get_fav_genre(self) -> List[str]:
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
