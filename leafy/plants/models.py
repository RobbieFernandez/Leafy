from django.db import models
from django.core.validators import MaxValueValidator
from django.contrib.auth.models import User

class Plant(models.Model):
    class DayOfTheWeek(models.TextChoices):
        MONDAY = ('MONDAY', 'Monday')
        TUESDAY = ('TUESDAY', 'Tuesday')
        WEDNESDAY = ('WEDNESDAY', 'Wednesday')
        THURSDAY = ('THURSDAY', 'Thursday')
        FRIDAY = ('FRIDAY', 'Friday')
        SATURDAY = ('SATURDAY', 'Saturday')
        SUNDAY = ('SUNDAY', 'Sunday')

    name = models.CharField(max_length=512)

    watering_day = models.PositiveIntegerField(
        choices=DayOfTheWeek.choices,
        null=True
    )

    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class WateredEvent(models.Model):
    plant = models.ForeignKey(Plant, on_delete=models.CASCADE)
    watered_on = models.DateTimeField()
    watered_by = models.ForeignKey(User, on_delete=models.CASCADE)
