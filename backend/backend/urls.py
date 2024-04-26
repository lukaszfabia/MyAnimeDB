from django.contrib import admin
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

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

def welcome(request):
    return HttpResponse(short_html, content_type='text/html')

urlpatterns = [
    path('', welcome, name='index'),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')), # sending a user to api.urls file
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

