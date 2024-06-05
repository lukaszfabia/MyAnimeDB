FROM python:3.11

WORKDIR /app

COPY  requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt 

COPY . /app/

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "172.18.0.3:8000"]

