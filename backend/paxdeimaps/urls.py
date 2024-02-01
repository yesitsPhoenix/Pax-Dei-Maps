from django.contrib import admin
from django.urls import path, include
from paxdeimaps import views
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import routers
from rest_framework.authtoken import views as authviews

router = routers.DefaultRouter()
router.register(r'api/resources', views.ResourceViewSet)
router.register(r'api/categories', views.CategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    path('api/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/auth/', authviews.obtain_auth_token)
]

urlpatterns += router.urls
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)