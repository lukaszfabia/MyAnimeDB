# Generated by Django 5.0.6 on 2024-05-18 15:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_alter_usersanime_score_alter_usersanime_state'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='anime',
            name='popularity',
        ),
        migrations.RemoveField(
            model_name='anime',
            name='ranked',
        ),
        migrations.RemoveField(
            model_name='anime',
            name='score',
        ),
    ]
