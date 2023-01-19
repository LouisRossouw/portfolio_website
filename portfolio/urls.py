from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("", views.portfolio_index, name="portfolio_index"),
    path("<int:pk>/", views.portfolio_detail, name="portfolio_detail"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)