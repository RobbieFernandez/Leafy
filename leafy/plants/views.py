from django.views.generic.edit import CreateView, DeleteView, UpdateView
from django.shortcuts import render

from plants.models import Plant

class PlantCreate(CreateView):
    model = Plant
    fields = ['name', 'watering_day']


class PlantUpdate(UpdateView):
    model = Plant
    fields = ['name', 'watering_day']

def dashboard(request):
    return render(request, "dashboard.html", {})
