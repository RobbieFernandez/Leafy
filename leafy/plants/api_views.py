from datetime import datetime

from rest_framework import decorators
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
import pytz

from .models import Plant, WateredEvent

DEFAULT_PLANT_PAGE_SIZE = 20
DATE_FORMAT = "%Y-%m-%dT%H:%M:%S"

@decorators.permission_classes([IsAuthenticated])
@decorators.api_view(['GET'])
def get_plants(request):
    page_number = request.GET.get('pageNumber', 1)
    page_size = request.GET.get('pageSize', DEFAULT_PLANT_PAGE_SIZE)

    page_start = (page_number - 1) * page_size
    page_end = page_start + page_size

    return JsonResponse({
        "plants": list(Plant.objects.filter(owner=request.user).values('name', 'id'))[page_start:page_end]
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
