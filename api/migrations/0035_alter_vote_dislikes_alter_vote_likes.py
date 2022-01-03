# Generated by Django 4.0 on 2021-12-29 21:24

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0034_alter_vote_answer_alter_vote_question'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vote',
            name='dislikes',
            field=models.ManyToManyField(null=True, related_name='dislikes', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='vote',
            name='likes',
            field=models.ManyToManyField(null=True, related_name='likes', to=settings.AUTH_USER_MODEL),
        ),
    ]
