from django.contrib import admin
from .models import Projects

# # Register your models here.

class Portfolio_admin(admin.ModelAdmin):
    list_display = ("title", "project_acronym", "description", "role", "technology", "image_main", "myshots_image", "raw_video", "clips_video", "blog", "produced_at", "youtube_link", "youtube_embed", "tag", "tags")



admin.site.register(Projects, Portfolio_admin)

