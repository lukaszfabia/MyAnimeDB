# Generated by Django 5.0.6 on 2024-05-28 17:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_delete_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='anime',
            name='popularity',
            field=models.IntegerField(default=0),
        ),
    ]
