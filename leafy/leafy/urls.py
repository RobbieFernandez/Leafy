"""leafy URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.urls import path, include
from django.views.generic.base import RedirectView
from django.conf import settings
from django_js_reverse.views import urls_js

from plants import urls as plant_urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path('jsreverse/', urls_js, name='js_reverse'),
    path('plants/', include(plant_urls)),
    path('', RedirectView.as_view(pattern_name=settings.LOGOUT_REDIRECT_URL)),
    path('login', auth_views.LoginView.as_view(template_name="login.html"), name="login"),
    path('logout', auth_views.LogoutView.as_view(template_name="logged_out.html"), name='logout')
]
