from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .models import Profile, MealPlan, WeeklyUpdate
from .serializers import UserSerializer, ProfileSerializer, MealPlanSerializer, WeeklyUpdateSerializer
from .social_views import GoogleLogin
from django.db.models import F

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        profile = user.profile
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def post(self, request):
        """Create or update profile - used during onboarding"""
        user = request.user
        profile = user.profile
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MealPlanListView(generics.ListAPIView):
    serializer_class = MealPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MealPlan.objects.filter(user=self.request.user).order_by('-start_date')

class MealPlanDetailView(generics.RetrieveAPIView):
    serializer_class = MealPlanSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    # We need to filter queryset by user so users can't see others' plans by ID
    def get_queryset(self):
        return MealPlan.objects.filter(user=self.request.user)

class WeeklyUpdateView(generics.ListCreateAPIView):
    serializer_class = WeeklyUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WeeklyUpdate.objects.filter(user=self.request.user).order_by('-date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class WeightHistoryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = getattr(user, 'profile', None)
        
        history = []
        if profile and profile.weight:
            history.append({
                'date': user.date_joined.date().isoformat(),
                'current_weight': profile.weight,
                'notes': 'Starting weight'
            })
        
        updates = WeeklyUpdate.objects.filter(user=user).order_by('date')
        for update in updates:
            history.append({
                'date': update.date.isoformat(),
                'current_weight': update.current_weight,
                'notes': update.notes
            })
            
        return Response(history)

class SocialProgressView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Get users with profiles and at least one weekly update
        # Simplified: Get top 5 users who have lost the most weight
        profiles = Profile.objects.exclude(user=request.user).select_related('user')
        
        social_data = []
        for p in profiles:
            first_weight = p.weight
            latest_update = WeeklyUpdate.objects.filter(user=p.user).order_by('-date').first()
            
            if latest_update and first_weight:
                lost = first_weight - latest_update.current_weight
                social_data.append({
                    'username': p.user.username,
                    'weight_lost': round(lost, 1),
                    'current_weight': latest_update.current_weight,
                    'date': latest_update.date.isoformat()
                })
        
        # Sort by weight lost and take top 5
        social_data = sorted(social_data, key=lambda x: x['weight_lost'], reverse=True)[:5]
        
        return Response(social_data)
