# Generated by Django 5.0.4 on 2024-04-27 07:47

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Anime',
            fields=[
                ('id_anime', models.AutoField(primary_key=True, serialize=False)),
                ('type', models.CharField(choices=[('TV', 'TV'), ('OVA', 'OVA'), ('Movie', 'Movie'), ('Special', 'Special'), ('ONA', 'ONA'), ('Music', 'Music')], max_length=10)),
                ('title', models.CharField(max_length=100)),
                ('alternative_title', models.CharField(max_length=200)),
                ('score', models.FloatField()),
                ('ranked', models.IntegerField()),
                ('popularity', models.IntegerField()),
                ('status', models.CharField(choices=[('Finished Airing', 'Finished Airing'), ('Currently Airing', 'Currently Airing'), ('Not yet aired', 'Not yet aired')], max_length=30)),
                ('description', models.TextField()),
                ('img_url', models.URLField()),
            ],
        ),
        migrations.CreateModel(
            name='Genre',
            fields=[
                ('id_genre', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(choices=[('Action', 'Action'), ('Comedy', 'Comedy'), ('Drama', 'Drama'), ('Fantasy', 'Fantasy'), ('Horror', 'Horror'), ('Mecha', 'Mecha'), ('Mystery', 'Mystery'), ('Romance', 'Romance'), ('Sci-Fi', 'Sci-Fi'), ('Slice of Life', 'Slice of Life'), ('Sports', 'Sports'), ('Supernatural', 'Supernatural'), ('Thriller', 'Thriller'), ('Psychological', 'Psychological'), ('Adventure', 'Adventure'), ('Historical', 'Historical'), ('Magic', 'Magic'), ('Military', 'Military'), ('Music', 'Music'), ('Parody', 'Parody'), ('School', 'School'), ('Shoujo', 'Shoujo'), ('Shounen', 'Shounen'), ('Space', 'Space'), ('Super Power', 'Super Power'), ('Vampire', 'Vampire'), ('Yaoi', 'Yaoi'), ('Yuri', 'Yuri'), ('Harem', 'Harem'), ('Josei', 'Josei'), ('Demons', 'Demons'), ('Game', 'Game'), ('Police', 'Police'), ('Samurai', 'Samurai'), ('Seinen', 'Seinen'), ('Shoujo Ai', 'Shoujo Ai'), ('Shounen Ai', 'Shounen Ai'), ('Kids', 'Kids')], max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='AnimeGenres',
            fields=[
                ('id_anime_genre', models.AutoField(primary_key=True, serialize=False)),
                ('anime', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.anime')),
                ('genre', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.genre')),
            ],
        ),
    ]
