######
# Stage 1: Build JS bundle.
#####$
FROM node:lts-slim AS js-builder

RUN mkdir /var/lib/leafy-js
WORKDIR /var/lib/leafy-js

COPY src/static/js src

RUN cd src && npm install && npm run build

######
# Stage 2: Build Python app.
#####$
FROM python:3.9.12-alpine as python-builder

RUN mkdir /var/lib/leafy
WORKDIR /var/lib/leafy

COPY requirements.txt .
RUN python3 -m venv vp
RUN vp/bin/pip install --no-cache-dir -r requirements.txt

COPY src src

COPY --from=js-builder \
    /var/lib/leafy-js/src/dist/bundle.js \
    /var/lib/leafy/src/static/js/dist/bundle.js

RUN apk add inkscape imagemagick make && \
    cd /var/lib/leafy/src/static/favicon && \
    make

# We can't run any management commands without the SECRET_KEY and DATABASE_URL
# environment variables being set. So just set them to dummy values since the
# collectstatic command doesn't actually care about them.
RUN cd src && \
    SECRET_KEY=DoesNotMatterForThisButMustBeSet \
    DATABASE_URL=sqlite:///var/lib/leafy/fake.db \
    /var/lib/leafy/vp/bin/python3.9 \
    manage.py collectstatic --noinput

# Remove all but the 'dist' portion of the static files
# so that we can copy only those files into our final image.
RUN mv src/static/dist static-dist && \
    rm -r src/static/* && \
    mv static-dist src/static/dist

######
# Stage 3: Package and start app.
#####$
FROM python:3.9.12-alpine

RUN mkdir /var/lib/leafy
WORKDIR /var/lib/leafy

COPY --from=python-builder /var/lib/leafy/vp vp
COPY --from=python-builder /var/lib/leafy/src src

COPY config config

COPY docker-scripts/runserver-entrypoint.sh .

CMD ./runserver-entrypoint.sh
