# Generated by Django 5.0.6 on 2024-05-29 11:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0021_characters_voiceactor'),
    ]

    operations = [
        migrations.AlterField(
            model_name='characters',
            name='img_url',
            field=models.ImageField(blank=True, null=True, upload_to=''),
        ),
        migrations.AlterField(
            model_name='voiceactor',
            name='img_url',
            field=models.ImageField(blank=True, null=True, upload_to=''),
        ),
    ]
