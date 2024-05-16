# Generated by Django 5.0.6 on 2024-05-16 20:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_anime_duration_anime_episodes'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usersanime',
            name='state',
            field=models.CharField(choices=[('watching', 'Watching'), ('completed', 'Completed'), ('on-hold', 'On-Hold'), ('dropped', 'Dropped'), ('plan-to-watch', 'Plan to Watch')], max_length=20),
        ),
    ]
