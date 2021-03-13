from .settings import *

DATABASES ['default'] = {
    'ENGINE': 'django.db.backends.sqlite3',
    'NAME': BASE_DIR / 'db.sqlite3',
}

ALLOWED_HOSTS = ["*"]

DEBUG = False

SECRET_KEY = '&=9mzx%benre*_gl+1#sf_m7uc6@c#4r5y))g9232io$ulgipk'
