# Generated by Django 4.0 on 2021-12-26 10:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0028_notification_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notification',
            name='receiverID',
            field=models.IntegerField(null=True, unique=True),
        ),
    ]
