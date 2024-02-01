# Use an official Nginx runtime as the base image
FROM nginx:latest

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy the static website files to the Nginx web root directory
COPY ./www /usr/share/nginx/html

# Expose port 8080 for the web server
EXPOSE 80

# Start the Nginx web server
CMD ["nginx", "-g", "daemon off;"]
