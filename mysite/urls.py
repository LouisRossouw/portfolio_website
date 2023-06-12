"""mysite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import os
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from wagtail.admin import urls as wagtailadmin_urls
from wagtail import urls as wagtail_urls
from wagtail.documents import urls as wagtaildocs_urls

from dailies import views as dailies


urlpatterns = [
    path(str(f"{os.getenv('ADMIN_LOGIN')}/"), admin.site.urls),
    path('', include('home.urls'), name='home'),

    path('dailies/', dailies.dailies_view, name="dailies"),
    path('ajax_capture_data/', dailies.ajax_return_data),
    path('ajax_add_vote/', dailies.ajax_add_vote),
    path('ajax_remove_comment/', dailies.ajax_remove_comment),

    path('portfolio/', include('portfolio.urls'), name='portfolio'),
    path('contact/', include('contact.urls'), name='contact'),

    path('cms/', include(wagtailadmin_urls)),
    path('documents/', include(wagtaildocs_urls)),
    path('', include(wagtail_urls)),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)



