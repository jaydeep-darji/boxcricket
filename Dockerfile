# Use official PHP-Apache image
FROM php:8.2-apache

# Enable Apache mod_rewrite for URL rewriting
RUN a2enmod rewrite

# Copy all project files into Apache's root directory
COPY . /var/www/html/

# Set correct permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Expose default web port
EXPOSE 80
