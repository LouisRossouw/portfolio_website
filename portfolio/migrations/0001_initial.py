# Generated by Django 4.1.4 on 2023-01-18 20:37

from django.db import migrations, models
import portfolio.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Projects',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(default=None, max_length=100)),
                ('project_acronym', models.CharField(default=None, max_length=3)),
                ('description', models.TextField(default=None)),
                ('role', models.TextField(default=None)),
                ('technology', models.CharField(default=None, max_length=20)),
                ('image_main', models.ImageField(upload_to=portfolio.models.main_image_path)),
                ('myshots_image', models.ImageField(upload_to=portfolio.models.myshots_image_path)),
                ('raw_video', models.FileField(upload_to=portfolio.models.raw_video_path)),
                ('clips_video', models.FileField(upload_to=portfolio.models.clips_video_path)),
                ('blog', models.TextField(default=None)),
                ('produced_at', models.TextField(default=None)),
                ('youtube_link', models.TextField(default=None)),
                ('youtube_embed', models.TextField(default=None)),
                ('tag', models.TextField(default=None)),
                ('tags', models.TextField(default=None)),
            ],
        ),
    ]
