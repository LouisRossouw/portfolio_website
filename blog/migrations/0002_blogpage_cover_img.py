# Generated by Django 4.1.4 on 2023-01-26 19:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='blogpage',
            name='cover_img',
            field=models.ImageField(default='hello', upload_to=''),
        ),
    ]
