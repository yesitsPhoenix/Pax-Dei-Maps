from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=30)
    icon = models.ImageField(null=True, blank=True)

    @property
    def icon_rel(self):
        if self.icon:
            return self.icon.url.lstrip('/')
        return None

    def __str__(self):
        return self.name