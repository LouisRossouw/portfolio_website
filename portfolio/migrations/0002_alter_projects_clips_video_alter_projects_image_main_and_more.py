# Generated by Django 4.1.4 on 2023-01-26 14:48

from django.db import migrations, models
import portfolio.models


class Migration(migrations.Migration):

    dependencies = [
        ('portfolio', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='projects',
            name='clips_video',
            field=models.FileField(blank=True, null=True, upload_to=portfolio.models.clips_video_path),
        ),
        migrations.AlterField(
            model_name='projects',
            name='image_main',
            field=models.ImageField(blank=True, null=True, upload_to=portfolio.models.main_image_path),
        ),
        migrations.AlterField(
            model_name='projects',
            name='myshots_image',
            field=models.ImageField(blank=True, null=True, upload_to=portfolio.models.myshots_image_path),
        ),
        migrations.AlterField(
            model_name='projects',
            name='raw_video',
            field=models.FileField(blank=True, null=True, upload_to=portfolio.models.raw_video_path),
        ),
    ]
