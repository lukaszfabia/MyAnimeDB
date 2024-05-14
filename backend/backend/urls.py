from django.contrib import admin
from django.http import HttpResponse
from django.urls import path, include
from django.conf.urls.static import static
from django.contrib import admin
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

from backend import settings
from api.views import RegistrationView

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


urlpatterns = [
    path("", MapOfAServer.as_view(), name="home_view"),
    path("admin/", admin.site.urls),
    path("api/", include("api.urls")),  # sending a user to api.urls file
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
