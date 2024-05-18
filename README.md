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
```

## Backend

```bash
cd MyAnimeDB/backend/
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver 
```

## Frontend

```bash
cd MyAnimeDB/frontend/
npm i
npm run dev 
```
