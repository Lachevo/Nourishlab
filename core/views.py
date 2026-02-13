from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .models import Profile, MealPlan, WeeklyUpdate
from .serializers import UserSerializer, ProfileSerializer, MealPlanSerializer, WeeklyUpdateSerializer
from .social_views import GoogleLogin

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
