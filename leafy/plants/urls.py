from django.urls import path

from . import views
from . import api_views

urlpatterns = [
    path('create/', views.PlantCreate.as_view(), name='plant-create'),
    path('update/', views.PlantUpdate.as_view(), name='plant-update'),
    path('dashboard/', views.dashboard, name='plant-dashbaord'),
    path('api/v1/get-plants', api_views.get_plants, name='get-plants')
]