from django.contrib import admin
from .models import Project, Capture, upvotes, comments

# Register your models here.
admin.site.register(Project)
admin.site.register(Capture)
admin.site.register(upvotes)
admin.site.register(comments)
