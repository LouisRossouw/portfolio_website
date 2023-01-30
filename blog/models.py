import os
import shutil

from django.db import models

from wagtail.models import Page
from wagtail.fields import RichTextField
from wagtail.admin.panels import FieldPanel
from wagtail.search import index

from wagtail.signals import page_published

from django.conf import settings

from .utils import reduce_gif_sizes





def main_image_path(instance, filename):
    """ creates a path for cover images in media/blog/blog name/cover/ """

    blog_name = str(instance).replace(" ", "_")
    path = f"blog/{blog_name}/cover/{filename}"

    return path



class BlogIndexPage(Page):
    """ Attributes for the main blog page that lists all the blogs. """

    intro = RichTextField(blank=True)

    content_panels = Page.content_panels + [
        FieldPanel('intro')
    ]


class BlogPage(Page):
    """ Attributes for the individual blog. """

    cover_img = models.ImageField(upload_to=main_image_path, blank=True, null=True)
    date = models.DateField("Post date") 
    intro = models.CharField(max_length=250)
    body = RichTextField(blank=True)

    search_fields = Page.search_fields + [
        index.SearchField('intro'),
        index.SearchField('body'),
    ]

    content_panels = Page.content_panels + [
        FieldPanel('cover_img'),
        FieldPanel('date'),
        FieldPanel('intro'),
        FieldPanel('body'),
    ]





# Signal for when a page is published.
def receiver(sender, instance, **kwargs):
    """ Signal for when a page is published. """

    # Reduce / remove gifs, if they are larger than the original.
    reduce_gif_sizes()




# Register listeners for each page model class
page_published.connect(receiver, sender=BlogPage)