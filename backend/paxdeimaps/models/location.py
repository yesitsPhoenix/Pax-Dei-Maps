from django.db import models
from paxdeimaps.models.resource import Resource

class Location(models.Model):
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name='locations')
    lat = models.IntegerField()
    lng = models.IntegerField()
    confirmations = models.IntegerField(default=0)