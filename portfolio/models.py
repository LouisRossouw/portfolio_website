from django.db import models

class Portfolio(models.Model):
    
    title = models.CharField(max_length=100)
    description = models.TextField()
    technology = models.CharField(max_length=20)
    image = models.FilePathField(path="/portfolio")
    
    blog = models.TextField()               # link to my blog webpage for specific project.
    produced_at = models.TextField()        # link to company.
    youtube_link = models.TextField()       # link to a youtube video.
    youtube_embed = models.TextField()      # link to an embeded video.
    tag = models.TextField()                # add a tag / film / advertising / etc.


