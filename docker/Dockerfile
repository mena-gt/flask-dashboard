FROM python:3.8

WORKDIR /usr/src/app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN pip install --upgrade cython \
    && pip install --upgrade pip

COPY ./requirements /usr/src/app/requirements

RUN pip install --no-cache-dir -r requirements/production.txt

COPY ./backend/ /usr/src/app/

# ENTRYPOINT ["/usr/src/app/entrypoint.sh"]