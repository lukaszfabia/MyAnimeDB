# Generated by Django 5.0.6 on 2024-05-14 17:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_alter_animegenres_id_anime_genre'),
    ]

    operations = [
        migrations.AddField(
            model_name='anime',
            name='duration',
            field=models.FloatField(null=True),
        ),
        migrations.AddField(
            model_name='anime',
            name='episodes',
            field=models.IntegerField(null=True),
        ),
    ]
