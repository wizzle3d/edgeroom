# Generated by Django 4.0 on 2021-12-17 08:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_alter_question_name_remove_question_tags_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='question',
            name='tags',
            field=models.ManyToManyField(to='api.Tag'),
        ),
    ]