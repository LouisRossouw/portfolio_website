# Generated by Django 4.1.4 on 2023-06-08 09:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dailies', '0003_alter_capture_path_to_capture'),
    ]

    operations = [
        migrations.AddField(
            model_name='capture',
            name='path_to_thumbnail',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
