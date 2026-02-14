from rest_framework import generics, permissions, status, serializers, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .models import Profile, MealPlan, WeeklyUpdate, Recipe, FoodLog, Message, LabResult
from .serializers import UserSerializer, ProfileSerializer, MealPlanSerializer, WeeklyUpdateSerializer, RecipeSerializer, FoodLogSerializer, MessageSerializer, LabResultSerializer
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
        from datetime import timedelta
        from django.utils import timezone
        
        # Check if user has already logged an update in the last 7 days
        latest_update = WeeklyUpdate.objects.filter(user=self.request.user).order_by('-date').first()
        
        if latest_update:
            # If the latest update was created today, it's definitely too soon
            # Note: models.DateField(auto_now_add=True) stores the date the object was created
            today = timezone.now().date()
            days_since_last_update = (today - latest_update.date).days
            
            if days_since_last_update < 7:
                next_available_date = latest_update.date + timedelta(days=7)
                raise serializers.ValidationError(
                    f"You can only log your progress once a week. Next update available on {next_available_date.strftime('%b %d, %Y')}."
                )
        
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

class RecipeViewSet(generics.RetrieveAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [permissions.IsAuthenticated]

class RecipeListView(generics.ListAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [permissions.IsAuthenticated]

class SocialProgressView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Get latest 20 updates from the community (excluding current user)
        # This creates a "Live Feed" feel rather than just a leaderboard
        recent_updates = WeeklyUpdate.objects.exclude(user=request.user).select_related('user', 'user__profile').order_by('-date', '-id')[:20]
        
        social_data = []
        for update in recent_updates:
            profile = getattr(update.user, 'profile', None)
            first_weight = profile.weight if profile else None
            
            weight_diff = 0
            if first_weight:
                weight_diff = update.current_weight - first_weight
                
            social_data.append({
                'username': update.user.username,
                'weight_lost': round(weight_diff * -1, 1), # Positive means lost, negative means gained
                'current_weight': update.current_weight,
                'date': update.date.isoformat(),
                'id': update.id
            })
        return Response(social_data)
        
class FoodLogViewSet(generics.ListCreateAPIView):
    serializer_class = FoodLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FoodLog.objects.filter(user=self.request.user).order_by('-date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        from django.db.models import Q
        user = self.request.user
        
        # If staff, they can filter by a recipient (client)
        client_username = self.request.query_params.get('client_username')
        if user.is_staff and client_username:
            return Message.objects.filter(
                (Q(sender=user) & Q(recipient__username=client_username)) |
                (Q(recipient=user) & Q(sender__username=client_username))
            ).order_by('timestamp')
            
        return Message.objects.filter(
            Q(sender=user) | Q(recipient=user)
        ).order_by('timestamp')

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

    @action(detail=False, methods=['post'])
    def mark_read(self, request):
        Message.objects.filter(recipient=request.user, is_read=False).update(is_read=True)
        return Response({'status': 'messages marked as read'})

class ConversationListView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        # Find all unique users who have exchanged messages with this staff member
        sent_to = Message.objects.filter(sender=request.user).values_list('recipient', flat=True)
        received_from = Message.objects.filter(recipient=request.user).values_list('sender', flat=True)
        
        user_ids = set(sent_to) | set(received_from)
        users = User.objects.filter(id__in=user_ids).exclude(id=request.user.id)
        
        # Also include all users if the staff wants to start a new chat? 
        # For now, just those with history.
        
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

class NutritionistView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Return all staff users who can act as nutritionists
        nutritionists = User.objects.filter(is_staff=True)
        serializer = UserSerializer(nutritionists, many=True)
        return Response(serializer.data)

class LabResultViewSet(generics.ListCreateAPIView):
    serializer_class = LabResultSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LabResult.objects.filter(user=self.request.user).order_by('-uploaded_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
