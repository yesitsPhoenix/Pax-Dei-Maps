#!/bin/bash

# Set the environment variables for the superuser credentials
SUPERUSER_NAME='admin'
SUPERUSER_EMAIL='admin@email.com'
SUPERUSER_PASSWORD='1234'

# Execute the command to create the superuser inside the Docker container
# Replace 'pax-dei-maps-backend-1' with the actual name of your Django backend container
docker exec -it -e DJANGO_SUPERUSER_USERNAME="$SUPERUSER_NAME" \
                 -e DJANGO_SUPERUSER_EMAIL="$SUPERUSER_EMAIL" \
                 -e DJANGO_SUPERUSER_PASSWORD="$SUPERUSER_PASSWORD" \
                 pax-dei-maps-backend-1 \
                 python manage.py createsuperuser --noinput

# Check if the command was successful
if [ $? -eq 0 ]; then
    echo "Superuser created successfully."
else
    echo "Failed to create superuser."
fi