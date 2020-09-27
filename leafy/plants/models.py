from django.db import models
from django.core.validators import MaxValueValidator

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

    def __str__(self):
        return self.name
