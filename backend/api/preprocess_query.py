from typing import List, Set

from api.models import Anime, UsersAnime
from django.db.models import Q

from api.stats import AnalyseAnime
import re


class Preprocess:
    # genre=Comedy&genre=Fantasy&genre=Harem&status=Currently Airing&keyword=e
    def __init__(self, query: str) -> None:
        self.query: str = query
        self.genres: List[str] = list()
        self.keyword: str = ""
        self.types: List[str] = list()
        self.statuses: List[str] = list()
        self.split_keywords()

    def split_keywords(self) -> None:
        """setting up a list of genres, keywords, types and status from the query string"""
        tokens: List[str] = re.split(r"&", self.query)
        for e in tokens:
            if "genre" in e:
                self.genres.append(e.split("=")[1])
            elif "keyword" in e:
                self.keyword = e.split("=")[1]
            elif "type" in e:
                self.types.append(e.split("=")[1])
            elif "status" in e:
                self.statuses.append(e.split("=")[1])

    def get_result(self):
        if self.query == "null" or self.query == "all" or self.query is None:
            return self.all_anime()
        else:
            return self.search()

    def all_anime(self):
        queryset = Anime.objects.all().order_by("title")

        return self.compute_rating(queryset)

    def search(self):
        query = Q()

        if self.genres:
            query |= Q(genres__name__in=self.genres)
        if self.types:
            query |= Q(type__in=self.types)
        if self.statuses:
            query |= Q(status__in=self.statuses)

        if self.keyword:
            query |= Q(title__icontains=self.keyword)
            query |= Q(alternative_title__icontains=self.keyword)

        queryset = Anime.objects.filter(query).distinct().order_by("title")

        return self.compute_rating(queryset)

    def compute_rating(self, queryset):
        for elem in queryset:
            rating = AnalyseAnime.compute_avg_rating(
                UsersAnime.objects.filter(id_anime=elem)
            )
            elem.rating = rating
        return queryset
