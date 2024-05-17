# Generated by Django 5.0.6 on 2024-05-14 16:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_animereviews'),
    ]

    operations = [
        migrations.AddField(
            model_name='anime',
            name='genres',
            field=models.ManyToManyField(through='api.AnimeGenres', to='api.genre'),
        ),
    ]