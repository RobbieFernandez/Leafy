from django.urls import path

from . import views

urlpatterns = [
    path('create/', views.PlantCreate.as_view(), name='plant-create'),
    path('update/', views.PlantUpdate.as_view(), name='plant-update'),
    path('dashboard/', views.dashboard, name='plant-dashbaord'),
]