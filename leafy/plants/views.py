from django.views.generic.edit import CreateView, DeleteView, UpdateView
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib import messages

from plants.models import Plant

class PlantEditView():
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = self.title
        return context

    def form_valid(self, form):
        form.instance.owner = self.request.user
        messages.add_message(self.request, messages.INFO, self.success_message)
        return super().form_valid(form)


class PlantCreate(PlantEditView, CreateView):
    model = Plant
    fields = Plant.form_fields
    title = "Leafy - Create Plant"
    success_message = "Plant created successfully"


class PlantUpdate(PlantEditView, UpdateView):
    model = Plant
    fields = Plant.form_fields
    title = "Leafy - Edit Plant"
    success_message = "Plant updated successfully"


@login_required()
def dashboard(request):
    return render(request, "dashboard.html", {})
