from datetime import datetime

from rest_framework import decorators
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.db.models import Subquery, OuterRef
from toolz import update_in
import pytz

from .models import Plant, WateredEvent
from .serializers import PlantSerializer

DEFAULT_PLANT_PAGE_SIZE = 20
DATE_FORMAT = "%Y-%m-%dT%H:%M:%S"

@decorators.permission_classes([IsAuthenticated])
@decorators.api_view(['GET'])
def get_plants(request):
    page_number = request.GET.get('pageNumber', 1)
    page_size = request.GET.get('pageSize', DEFAULT_PLANT_PAGE_SIZE)

    page_start = (page_number - 1) * page_size
    page_end = page_start + page_size

    plant_queryset = Plant.objects.annotate(
        last_watered=Subquery(
            WateredEvent.objects.filter(
                plant_id=OuterRef('id')
            ).values_list('watered_on').order_by('-watered_on')[:1]
        )
    ).filter(
        owner=request.user
    ).values('name', 'id', 'last_watered')

    def format_row(plant_row):
        return update_in(
            plant_row,
            ['last_watered'],
            lambda d: d.strftime(DATE_FORMAT) if d is not None else None
        )

    return JsonResponse({
        "plants": [format_row(p) for p in plant_queryset[page_start:page_end]]
    })



@decorators.permission_classes([IsAuthenticated])
@decorators.parser_classes([JSONParser])
@decorators.api_view(['POST'])
def water_plant(request):
    plant = get_object_or_404(Plant, id=request.data['plantId'])

    if 'time' in request.data:
        watered_on = datetime.strptime(request.data['time'], DATE_FORMAT)
    else:
        watered_on = datetime.utcnow()

    watered_on = pytz.utc.localize(watered_on)

    WateredEvent.objects.create(plant=plant, watered_on=watered_on, watered_by=request.user)

    return JsonResponse({"message": "success"})


@decorators.permission_classes([IsAuthenticated])
@decorators.api_view(['GET'])
def plant_details(request, plant_id):
    plant = get_object_or_404(Plant, id=plant_id)
    return JsonResponse(PlantSerializer(plant).data)


@decorators.permission_classes([IsAuthenticated])
@decorators.parser_classes([JSONParser])
@decorators.api_view(['POST'])
def create_plant(request):
    serialized_plant = PlantSerializer(data=request.data)

    if serialized_plant.is_valid():
        plant = serialized_plant.save(owner_id=request.user.id)
        return JsonResponse({"message": "success", "plantId": plant.id})

    return JsonResponse({"message": "Unable to create plant. Invalid data received"}, status=400)


@decorators.permission_classes([IsAuthenticated])
@decorators.parser_classes([JSONParser])
@decorators.api_view(['PUT'])
def update_plant(request, plant_id):
    plant = get_object_or_404(Plant, id=plant_id)
    serialized_plant = PlantSerializer(plant, data=request.data)

    if serialized_plant.is_valid():
        serialized_plant.save(owner_id=request.user.id)
        return JsonResponse({"message": "success", "plantId": plant_id})

    return JsonResponse({"message": "Unable to create plant. Invalid data received"}, status=400)

@decorators.permission_classes([IsAuthenticated])
@decorators.parser_classes([JSONParser])
@decorators.api_view(['DELETE'])
def delete_plant(request, plant_id):
    plant = get_object_or_404(Plant, id=plant_id)
    plant.delete()
    return JsonResponse({"message": "success", "plantId": plant_id})
