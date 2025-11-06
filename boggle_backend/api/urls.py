from django.urls import path
from . import views

urlpatterns = [
    path('game/create/<int:size>', views.create_game, name='create_game'),
]
