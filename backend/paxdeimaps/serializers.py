from paxdeimaps.models.category import Category
from paxdeimaps.models.resource import Resource
from paxdeimaps.models.location import Location
from paxdeimaps.models.rarity import Rarity
from rest_framework import serializers

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name']

class RaritySerializer(serializers.ModelSerializer):
    class Meta:
        model = Rarity  # Assuming you have a Rarity model
        fields = ['name']

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['lng', 'lat']

class ResourceSerializer(serializers.ModelSerializer):
    icon_rel = serializers.ReadOnlyField()
    category = CategorySerializer(read_only=True)
    rarity = RaritySerializer(read_only=True)
    locations = LocationSerializer(many=True, read_only=True)

    class Meta:
        model = Resource
        fields = ['id', 'url', 'name', 'category', 'rarity', 'locations', 'icon_rel']

class SimplifiedResourceSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Resource
        fields = ['name', 'url']  # Only include the name and URL
        extra_kwargs = {
            'url': {'view_name': 'resource-detail', 'lookup_field': 'pk'}
        }

class CategorySerializer(serializers.ModelSerializer):
    icon_rel = serializers.ReadOnlyField()
    resources = SimplifiedResourceSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'icon_rel', 'resources']