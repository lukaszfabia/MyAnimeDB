from django.contrib import admin
from django.http import HttpResponse
from django.urls import path, include
from django.conf.urls.static import static
from django.contrib import admin
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from api.views.general_views import GetRoutesView

from backend import settings

short_html = """
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Anime api</title>
</head>

<body>
    <div style="margin: 100px;">
        <h1>Welcome to my anime db api</h1>
        <h2>check all routes <a href="/api/">here</a></h2>
        <h2>created by: <a href="https://github.com/lukaszfabia">lukasz fabia</a></h2>
    </div>
</body>

</html>
"""


class MapOfAServer(ListAPIView):
    """General view of the server"""

    permission_classes = [AllowAny]
    queryset = []

    def get(self, request):
        endpoints = [
            {"route": "api/", "description": "Main view of all routes in the API"},
            {"route": "admin/", "description": "Admin page"},
        ]
        return Response(endpoints)


# cdwb tkyn hofc rsxx

urlpatterns = [
    path("", MapOfAServer.as_view(), name="home_view"),
    path("admin/", admin.site.urls),
    path("api/auth/", include("api.auth_urls")),  # sending a user to api.auth_urls file
    path("api/user/", include("api.user_urls")),  # sending a user to api.urls file
    path("api/anime/", include("api.anime_urls")),
    path(
        "api/", GetRoutesView.as_view(), name="get_routes"
    ),  # sending a user to api.urls file
    # path("api/", include("api.urls")),  # sending a user to api.urls file
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
