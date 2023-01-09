from contact import views
from django.urls import path


urlpatterns = [
    path('', views.contact_page, name='contact'),
]