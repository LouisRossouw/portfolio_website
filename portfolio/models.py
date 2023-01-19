from django.db import models

def main_image_path(instance, filename):
    path = f"portfolio/{instance.project_acronym}.png"
    return path

def myshots_image_path(instance, filename):
    path = "portfolio/additional_images/" + f"{instance.project_acronym}/myshots/{filename}"
    return path

def raw_video_path(instance, filename):
    path = "portfolio/additional_images/" + f"{instance.project_acronym}/raw/{filename}"
    return path

def clips_video_path(instance, filename):
    path = "portfolio/additional_images/" + f"{instance.project_acronym}/clips/{filename}"
    return path



class Projects(models.Model):
    
    title = models.CharField(max_length=100, default=None)
    project_acronym = models.CharField(max_length=3, default=None)
    description = models.TextField(default=None)
    role = models.TextField(default=None)
    technology = models.CharField(max_length=20, default=None)

    image_main = models.ImageField(upload_to=main_image_path, blank=True, null=True)

    myshots_image = models.ImageField(upload_to=myshots_image_path, blank=True, null=True)
    raw_video = models.FileField(upload_to=raw_video_path, blank=True, null=True)
    clips_video = models.FileField(upload_to=clips_video_path, blank=True, null=True)

    blog = models.TextField(default=None)               # link to my blog webpage for specific project.
    produced_at = models.TextField(default=None)        # link to company.
    youtube_link = models.TextField(default=None)       # link to a youtube video.
    youtube_embed = models.TextField(default=None)      # link to an embeded video.
    tag = models.TextField(default=None)                # add a tag / film / advertising / etc.
    tags = models.TextField(default=None)


