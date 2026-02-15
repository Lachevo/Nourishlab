import os
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User


class Command(BaseCommand):
    help = 'Creates a superuser automatically if one does not exist'

    def handle(self, *args, **options):
        # Check if any superuser exists
        if User.objects.filter(is_superuser=True).exists():
            self.stdout.write(self.style.SUCCESS('Superuser already exists. Skipping creation.'))
            return

        # Get credentials from environment variables or use defaults
        username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
        email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@nourishlab.com')
        password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'admin123')

        # Create the superuser
        User.objects.create_superuser(
            username=username,
            email=email,
            password=password
        )

        self.stdout.write(
            self.style.SUCCESS(
                f'Superuser created successfully!\n'
                f'Username: {username}\n'
                f'Email: {email}\n'
                f'Password: {"*" * len(password)}'
            )
        )
        
        # Security warning
        if password == 'admin123':
            self.stdout.write(
                self.style.WARNING(
                    '\n⚠️  WARNING: Using default password "admin123".\n'
                    'Please set DJANGO_SUPERUSER_PASSWORD environment variable for production!'
                )
            )
