# Define the environment variables for the superuser credentials
$Env:SUPERUSER_NAME = 'admin'
$Env:SUPERUSER_EMAIL = 'admin@email.com'
$Env:SUPERUSER_PASSWORD = '1234'

# Execute the command to create the superuser inside the Docker container
# Replace 'pax-dei-maps-backend-1' with the actual name of your Django backend container
docker exec -it -e "DJANGO_SUPERUSER_USERNAME=$Env:SUPERUSER_NAME" `
                 -e "DJANGO_SUPERUSER_EMAIL=$Env:SUPERUSER_EMAIL" `
                 -e "DJANGO_SUPERUSER_PASSWORD=$Env:SUPERUSER_PASSWORD" `
                 pax-dei-maps-backend-1 `
                 python manage.py createsuperuser --noinput

# Check if the command was successful
if ($?) {
    Write-Host "Superuser created successfully."
} else {
    Write-Host "Failed to create superuser."
}
