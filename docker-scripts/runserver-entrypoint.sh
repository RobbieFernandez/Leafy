#!/bin/sh

# Run migrations
/var/lib/leafy/vp/bin/python3.9 /var/lib/leafy/src/manage.py migrate

# Collect static files
# yes yes | /var/lib/leafy/vp/bin/python3.9 /var/lib/leafy/src/manage.py collectstatic

# Start server
cd /var/lib/leafy/src/ && \
    exec /var/lib/leafy/vp/bin/gunicorn \
        -c /var/lib/leafy/config/gunicorn.conf.py \
        --worker-tmp-dir ${TMPDIR:-/tmp} \
        leafy.wsgi:application

