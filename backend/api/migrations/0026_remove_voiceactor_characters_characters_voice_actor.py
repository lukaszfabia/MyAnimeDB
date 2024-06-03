# Generated by Django 5.0.6 on 2024-05-29 14:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0025_remove_characters_anime_characters_anime'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='voiceactor',
            name='characters',
        ),
        migrations.AddField(
            model_name='characters',
            name='voice_actor',
            field=models.ManyToManyField(related_name='characters', to='api.voiceactor'),
        ),
    ]