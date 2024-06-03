# Generated by Django 5.0.6 on 2024-05-29 10:55

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0020_alter_post_user'),
    ]

    operations = [
        migrations.CreateModel(
            name='Characters',
            fields=[
                ('id_character', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('img_url', models.URLField()),
                ('anime', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.anime')),
            ],
        ),
        migrations.CreateModel(
            name='VoiceActor',
            fields=[
                ('id_voice_actor', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('img_url', models.URLField()),
                ('characters', models.ManyToManyField(to='api.characters')),
            ],
        ),
    ]