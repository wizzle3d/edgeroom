# Generated by Django 4.0 on 2021-12-16 16:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_rename_rooms_room'),
    ]

    operations = [
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
            ],
        ),
    ]