# Generated by Django 4.1.4 on 2023-06-11 18:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dailies', '0009_remove_upvotes_user_upvotes_user_ip'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='comments',
            name='user',
        ),
        migrations.AddField(
            model_name='comments',
            name='user_ip',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
    ]
