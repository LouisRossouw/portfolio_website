# Generated by Django 4.1.4 on 2023-06-11 21:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dailies', '0010_remove_comments_user_comments_user_ip'),
    ]

    operations = [
        migrations.AddField(
            model_name='comments',
            name='date_time',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
