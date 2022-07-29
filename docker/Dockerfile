FROM python:3.8.13-slim

WORKDIR /usr/src/app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update

RUN apt-get install python3-dev \
	musl-dev gfortran libffi-dev openssl-dev \
	libxml2 libxml2-dev libxslt libxslt-dev zlib-dev

RUN pip install --upgrade cython \
    && pip install --upgrade pip

COPY ./requirements /usr/src/app/requirements

RUN pip install --no-cache-dir -r requirements/production.txt

COPY ./backend/ /usr/src/app/

# ENTRYPOINT ["/usr/src/app/entrypoint.sh"]