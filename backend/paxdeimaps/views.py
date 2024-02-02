from paxdeimaps.models.category import Category
from paxdeimaps.models.resource import Resource
from rest_framework import permissions, viewsets

from paxdeimaps.serializers import ResourceSerializer, CategorySerializer


class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]