from rest_framework import decorators
from rest_framework.permissions import IsAuthenticated

from django.http import JsonResponse

@decorators.permission_classes([IsAuthenticated])
def get_plants(request):
    return JsonResponse({"plants": ['Succulent', 'Ficus', 'Bamboo', 'Orchid']})