from django.db import models

# creating a model class below
class Game(models.Model):
    size = models.IntegerField()
    grid = models.TextField()
    foundwords = models.TextField()

    def __str__(self):
        return f"Game {self.id} ({self.size}x{self.size})"