from django.db import models

from wagtail.models import Page
from wagtail.fields import RichTextField
from wagtail.admin.panels import FieldPanel
from wagtail.search import index


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