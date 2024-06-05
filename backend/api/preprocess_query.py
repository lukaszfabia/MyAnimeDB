from typing import List

from .models import *
from django.db.models import Q
from django.db.models import Count

from api.stats import AnalyseAnime
import re

# genre=Comedy&genre=Fantasy&genre=Harem&status=Currently Airing&keyword=e


class Preprocess:
    """
    Preprocesses the query string to filter and search anime based on genres, keywords, types, and statuses.

    Attributes:
        query (str): The query string containing filters.
        genres (List[str]): List of genres extracted from the query.
        keyword (str): Keyword for searching titles or alternative titles.
        types (List[str]): List of anime types extracted from the query.
        statuses (List[str]): List of anime statuses extracted from the query.
    """

    def __init__(self, query: str) -> None:
        """
        Initializes the Preprocess class with a query string.

        Args:
            query (str): The query string containing filters.
        """
        self.query: str = query
        self.genres: List[str] = list()
        self.keyword: str = ""
        self.types: List[str] = list()
        self.statuses: List[str] = list()
        self.split_keywords()

    def split_keywords(self) -> None:
        """
        Splits the query string into genres, keywords, types, and statuses.

        This method parses the query string and populates the genres, keyword, types, and statuses attributes.
        """
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
        """
        Returns the search results based on the query string.

        Returns:
            List[Anime]: A list of anime objects that match the search criteria.
        """
        if self.query == "null" or self.query == "all" or self.query is None:
            return self.all_anime()
        else:
            return self.search()

    def all_anime(self):
        """
        Returns all anime objects ordered by title.

        Returns:
            List[Anime]: A list of all anime objects ordered by title.
        """
        queryset = Anime.objects.all().order_by("title")

        return self.compute_rating(queryset)

    def search(self):
        """
        Searches for anime objects based on genres, keywords, types, and statuses.

        Returns:
            List[Anime]: A list of anime objects that match the search criteria.
        """

        # default queryset
        queryset = Anime.objects.all()

        if self.genres:
            # creating a subquery to filter out anime that don't have all the selected genres
            subquery = (
                Anime.objects.filter(genres__name__in=self.genres)
                .annotate(
                    num_genres=Count("genres")
                )  # compute the number of genres for each anime
                .values_list("id_anime", flat=True)  # get the id of each anime
            )

            # filter out anime that don't have all the selected genres
            queryset = (
                queryset.filter(id_anime__in=subquery, genres__name__in=self.genres)
                .annotate(num_genres=Count("genres"))
                .filter(num_genres=len(self.genres))
            )

        if self.statuses:
            queryset = queryset.filter(status__in=self.statuses)

        if self.types:
            queryset = queryset.filter(type__in=self.types)

        if self.keyword:
            queryset = queryset.filter(title__icontains=self.keyword) | queryset.filter(
                alternative_title__icontains=self.keyword
            )

        queryset = queryset.distinct().order_by("title")
        return self.compute_rating(queryset) if queryset else []

    def compute_rating(self, queryset):
        """
        Computes the average rating for each anime in the queryset.

        Args:
            queryset (QuerySet): The queryset of anime objects.

        Returns:
            List[Anime]: The queryset with updated ratings.
        """
        for elem in queryset:
            rating = AnalyseAnime.compute_avg_rating(
                UsersAnime.objects.filter(id_anime=elem)
            )
            elem.rating = rating
        return queryset
