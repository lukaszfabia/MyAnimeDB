[![Django CI](https://github.com/lukaszfabia/MyAnimeDB/actions/workflows/django.yml/badge.svg)](https://github.com/lukaszfabia/MyAnimeDB/actions/workflows/django.yml)

# MyAnimeDB

**Ogólnie o projekcie**. 

Projekt składa się z dwóch części:
- Frontend `(React + TypeScript + Vite, Bootstrap 5)`
- Backend `(DRF - Django rest framework)`


Jak to działa? 

Front wysyła żądania do backendu a backend wysyła odpowiedź, tyle i aż tyle.

Jak odpalić?

```bash
cd
git clone https://github.com/lukaszfabia/MyAnimeDB
cd MyAnimeDB
sudo docker-compose up --build
```