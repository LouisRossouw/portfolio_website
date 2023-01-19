from django.contrib import admin
from .models import ignore_list, Email_list

# # Register your models here.
# admin.site.register([ignore_list, Email_list])


class Ignore_list_Admin(admin.ModelAdmin):
    list_display = ("email",)


class Email_list_Admin(admin.ModelAdmin):
    list_display = ("name", "email", "time",)

admin.site.register(ignore_list, Ignore_list_Admin)
admin.site.register(Email_list, Email_list_Admin)