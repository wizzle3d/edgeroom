# Generated by Django 4.0 on 2021-12-24 09:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0021_alter_user_avatar'),
    ]

    operations = [
        migrations.AlterField(
            model_name='answer',
            name='body',
            field=models.JSONField(null=True),
        ),
        migrations.AlterField(
            model_name='question',
            name='description',
            field=models.JSONField(null=True),
        ),
    ]
