# Generated by Django 4.0 on 2021-12-26 11:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0029_alter_notification_receiverid'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='notificationobject',
            name='entityID',
        ),
        migrations.RemoveField(
            model_name='notificationobject',
            name='questionID',
        ),
        migrations.AddField(
            model_name='notificationobject',
            name='entity',
            field=models.JSONField(null=True),
        ),
        migrations.AddField(
            model_name='notificationobject',
            name='parent',
            field=models.JSONField(null=True),
        ),
    ]
