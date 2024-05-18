# Generated by Django 5.0.6 on 2024-05-18 11:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_alter_usersanime_score'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usersanime',
            name='score',
            field=models.CharField(choices=[('0', 'None'), ('1', 'Bad'), ('2', 'Boring'), ('3', 'Ok'), ('4', 'Very good'), ('5', 'Excellent'), ('6', 'Masterpiece')], default='0', max_length=20),
        ),
        migrations.AlterField(
            model_name='usersanime',
            name='state',
            field=models.CharField(choices=[('watching', 'Watching'), ('completed', 'Completed'), ('on-hold', 'On-Hold'), ('dropped', 'Dropped'), ('plan-to-watch', 'Plan to Watch')], default='watching', max_length=20),
        ),
    ]
