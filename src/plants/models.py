from django.db import models
from django.core.validators import MaxValueValidator
from django.contrib.auth.models import User
from django.urls import reverse

class Plant(models.Model):
    form_fields = [
        "name", "warning_threshold", "danger_threshold", "owner_id"
    ]

    name = models.CharField(max_length=512)

    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    warning_threshold = models.PositiveIntegerField(
        help_text=(
            'Plant will be shown in the "Water Soon" section of the dashboard '
            'after this many days since the last watering'
        )
    )

    danger_threshold = models.PositiveIntegerField(
        help_text=(
            'Plant will be shown in the "Water Now" section of the dashboard '
            'after this many days since the last watering'
        )
    )


    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("plant-update", args=(str(self.id),))


class WateredEvent(models.Model):
    plant = models.ForeignKey(Plant, on_delete=models.CASCADE)
    watered_on = models.DateTimeField()
    watered_by = models.ForeignKey(User, on_delete=models.CASCADE)
