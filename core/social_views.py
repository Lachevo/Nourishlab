from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
import os
from rest_framework import status
from rest_framework.response import Response
from .serializers import UserSerializer

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = os.environ.get("GOOGLE_CALLBACK_URL", "http://localhost:5174/login")
    client_class = OAuth2Client
    
    def post(self, request, *args, **kwargs):
        # Log payload for debugging
        with open("/tmp/google_auth_debug.log", "a") as f:
            f.write(f"\nDEBUG: GoogleLogin payload: {request.data}\n")
        
        # Patch for frontend sending id_token instead of access_token
        if 'id_token' in request.data and 'access_token' not in request.data:
            # dj-rest-auth's SocialLoginSerializer expects 'access_token' or 'code'
            # We can duplicate the id_token value into access_token
            request.data._mutable = True if hasattr(request.data, '_mutable') else False
            if hasattr(request.data, 'copy'):
                # Handle QueryDict or regular dict
                data = request.data.copy()
                data['access_token'] = request.data['id_token']
                request._full_data = data # For DRF
            else:
                request.data['access_token'] = request.data['id_token']

        # Log info for debugging SocialApp issue
        from django.contrib.sites.models import Site
        from allauth.socialaccount.models import SocialApp
        try:
            current_site = Site.objects.get_current(request)
            apps = SocialApp.objects.filter(provider='google', sites=current_site)
            print(f"DEBUG: Current Site ID: {current_site.id}, Domain: {current_site.domain}")
            print(f"DEBUG: Linked Google SocialApps count: {apps.count()}")
        except Exception as se:
            print(f"DEBUG: Error checking Site/App: {str(se)}")

        try:
            response = super().post(request, *args, **kwargs)
            if response.status_code == status.HTTP_200_OK:
                # Add user data to response
                user = request.user
                if user and user.is_authenticated:
                    serializer = UserSerializer(user)
                    response.data['user'] = serializer.data
            return response
        except Exception as e:
            error_msg = str(e)
            import traceback
            tb = traceback.format_exc()
            with open("/tmp/google_auth_debug.log", "a") as f:
                f.write(f"DEBUG: GoogleLogin EXCEPTION: {error_msg}\n")
                f.write(f"DEBUG: Traceback: {tb}\n")
            
            # Print to stdout too so it shows in Render logs
            print(f"DEBUG GoogleLogin failed: {error_msg}")
            print(f"DEBUG Traceback: {tb}")
            
            return Response(
                {"detail": error_msg, "traceback": tb if os.environ.get('DEBUG') == 'True' else None},
                status=status.HTTP_400_BAD_REQUEST
            )
