# Informacje o serwerze (REST API).

Backend `(DRF - Django rest framework)`

**Serwer API dzieli się 3 gółwne endpointy**

- auth - związane z zmieną danych usera oraz logowaniem (generowaniem tokena JWT),
- user - wszelkiej maści informacje o userze, mogą się łączyć z anime,
- anime - wszelkiej maści informacje o anime, mogą się łączyć z userem.

_serwer zawiera takze endpoint z mediami, czyli pliki jpeg, png, jpg_.

Na endpoincie api/ jest cała mapa serwera.
