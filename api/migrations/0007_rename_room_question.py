# Generated by Django 4.0 on 2021-12-16 18:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_room_tags'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Room',
            new_name='Question',
        ),
    ]