from rest_framework import serializers

from plants.models import Plant

class PlantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plant
        fields = Plant.form_fields
