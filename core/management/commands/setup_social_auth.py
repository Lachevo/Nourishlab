import os
from django.core.management.base import BaseCommand
from django.contrib.sites.models import Site
from allauth.socialaccount.models import SocialApp

class Command(BaseCommand):
    help = 'Setup Social Application and Site for Google Auth'

    def handle(self, *args, **options):
        # Determine current domain (DO NOT include https:// here for Site model)
        render_host = os.environ.get('RENDER_EXTERNAL_HOSTNAME')
        domain = render_host if render_host else "localhost:5174"
        name = "NourishLab (Prod)" if render_host else "NourishLab (Local)"

        self.stdout.write(f"DEBUG: Setting up Site with domain: {domain}")

        # Setup Site
        site, created = Site.objects.get_or_create(id=1, defaults={'domain': domain, 'name': name})
        if not created:
            site.domain = domain
            site.name = name
            site.save()
        self.stdout.write(self.style.SUCCESS(f'Successfully setup Site: {site.domain}'))

        # Setup Social App
        client_id = os.environ.get('GOOGLE_CLIENT_ID')
        client_secret = os.environ.get('GOOGLE_CLIENT_SECRET')

        self.stdout.write(f"DEBUG: GOOGLE_CLIENT_ID found: {'Yes' if client_id else 'No'}")
        
        if not client_id or 'YOUR_GOOGLE_CLIENT_ID' in client_id:
            self.stdout.write(self.style.WARNING('GOOGLE_CLIENT_ID is missing or using placeholder. Setup skipped for SocialApp.'))
            return

        app, created = SocialApp.objects.get_or_create(
            provider='google',
            defaults={
                'name': 'Google Auth',
                'client_id': client_id,
                'secret': client_secret,
            }
        )

        if not created:
            app.client_id = client_id
            app.secret = client_secret
            app.save()
            self.stdout.write(self.style.SUCCESS(f'Successfully updated existing SocialApp with ID: {client_id[:10]}...'))
        else:
            app.sites.add(site)
            self.stdout.write(self.style.SUCCESS(f'Successfully created and linked SocialApp with ID: {client_id[:10]}...'))
