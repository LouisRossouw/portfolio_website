from django.db import models

class Portfolio(models.Model):
    
    title = models.CharField(max_length=100, default=None)
    project_acronym = models.CharField(max_length=3, default=None)
    description = models.TextField(default=None)
    additional_description = models.TextField(default=None)
    technology = models.CharField(max_length=20, default=None)
    image = models.FilePathField(path="/portfolio")

    
    blog = models.TextField(default=None)               # link to my blog webpage for specific project.
    produced_at = models.TextField(default=None)        # link to company.
    youtube_link = models.TextField(default=None)       # link to a youtube video.
    youtube_embed = models.TextField(default=None)      # link to an embeded video.
    tag = models.TextField(default=None)                # add a tag / film / advertising / etc.


