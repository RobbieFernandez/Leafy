from django.urls import path

from . import views
from . import api_views

urlpatterns = [
    # path('create/', views.PlantCreate.as_view(), name='plant-create'),
    # path('update/<int:pk>/', views.PlantUpdate.as_view(), name='plant-update'),
    path('dashboard/', views.dashboard, name='plant-dashbaord'),
    path('api/v1/plants-get-dashboard', api_views.get_plants, name='get-plants'),
    path('api/v1/plant-water', api_views.water_plant, name='water-plant'),
    path('api/v1/plant-details/<int:plant_id>', api_views.plant_details, name='plant-details'),
    path('api/v1/plant-create', api_views.create_plant, name='plant-create'),
    path('api/v1/plant-update/<int:plant_id>', api_views.update_plant, name='plant-update'),
]
