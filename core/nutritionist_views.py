from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.db.models import Q, Prefetch
from .models import Profile, MealPlan, WeeklyUpdate, FoodLog, LabResult, Recipe, MealPlanTemplate, NutritionistNote
from .serializers import (
    UserSerializer, ProfileSerializer, MealPlanSerializer, 
    WeeklyUpdateSerializer, FoodLogSerializer, LabResultSerializer,
    MealPlanTemplateSerializer, NutritionistNoteSerializer
)
from .permissions import IsNutritionist


class NutritionistPatientListView(generics.ListAPIView):
    """
    List all patients (non-nutritionist users) for the nutritionist.
    """
    serializer_class = UserSerializer
    permission_classes = [IsNutritionist]

    def get_queryset(self):
        # Return all users who are not nutritionists and not staff
        return User.objects.filter(
            profile__is_nutritionist=False,
            profile__is_approved=True,
            is_staff=False
        ).select_related('profile').order_by('username')


class NutritionistPendingPatientsListView(generics.ListAPIView):
    """
    List all pending (unapproved) patients for the nutritionist.
    """
    serializer_class = UserSerializer
    permission_classes = [IsNutritionist]

    def get_queryset(self):
        return User.objects.filter(
            profile__is_nutritionist=False,
            profile__is_approved=False,
            is_staff=False
        ).select_related('profile').order_by('-date_joined')


class ApprovePatientView(APIView):
    """
    Approve a pending patient.
    """
    permission_classes = [IsNutritionist]

    def post(self, request, patient_id):
        try:
            patient = User.objects.get(id=patient_id, profile__is_nutritionist=False)
            profile = patient.profile
            profile.is_approved = True
            profile.save()
            return Response({'status': 'Patient approved successfully'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)


class NutritionistPatientDetailView(generics.RetrieveAPIView):
    """
    Detailed view of a single patient for nutritionists.
    Includes profile, meal plans, weekly updates, food logs, and lab results.
    """
    serializer_class = UserSerializer
    permission_classes = [IsNutritionist]

    def get_queryset(self):
        return User.objects.filter(
            profile__is_nutritionist=False,
            is_staff=False
        ).select_related('profile').prefetch_related(
            'meal_plans',
            'weekly_updates',
            'food_logs',
            'lab_results'
        )

    def retrieve(self, request, *args, **kwargs):
        patient = self.get_object()
        
        # Build comprehensive patient data
        patient_data = UserSerializer(patient).data
        
        # Add related data
        patient_data['meal_plans'] = MealPlanSerializer(
            patient.meal_plans.all().order_by('-start_date'), 
            many=True,
            context={'request': request}
        ).data
        
        patient_data['weekly_updates'] = WeeklyUpdateSerializer(
            patient.weekly_updates.all().order_by('-date')[:10], 
            many=True,
            context={'request': request}
        ).data
        
        patient_data['food_logs'] = FoodLogSerializer(
            patient.food_logs.all().order_by('-date')[:20], 
            many=True,
            context={'request': request}
        ).data
        
        patient_data['lab_results'] = LabResultSerializer(
            patient.lab_results.all().order_by('-uploaded_at'), 
            many=True,
            context={'request': request}
        ).data
        
        return Response(patient_data)


class NutritionistMealPlanViewSet(viewsets.ModelViewSet):
    """
    Allows nutritionists to create, update, and delete meal plans for patients.
    """
    serializer_class = MealPlanSerializer
    permission_classes = [IsNutritionist]

    def get_queryset(self):
        # Nutritionists can see all meal plans
        return MealPlan.objects.all().select_related('user').order_by('-start_date')

    def create(self, request, *args, **kwargs):
        # Nutritionist must specify the user (patient) for the meal plan
        user_id = request.data.get('user_id')
        if not user_id:
            return Response(
                {'error': 'user_id is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            patient = User.objects.get(id=user_id, profile__is_nutritionist=False)
        except User.DoesNotExist:
            return Response(
                {'error': 'Patient not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=patient)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class NutritionistMealPlanTemplateViewSet(viewsets.ModelViewSet):
    """
    Manage meal plan templates that nutritionists can reuse.
    """
    serializer_class = MealPlanTemplateSerializer
    permission_classes = [IsNutritionist]
    queryset = MealPlanTemplate.objects.all().order_by('-created_at')


class NutritionistDashboardStatsView(APIView):
    """
    Provides summary statistics for the nutritionist dashboard.
    """
    permission_classes = [IsNutritionist]

    def get(self, request):
        total_patients = User.objects.filter(
            profile__is_nutritionist=False,
            is_staff=False
        ).count()
        
        approved_patients = User.objects.filter(
            profile__is_nutritionist=False,
            profile__is_approved=True,
            is_staff=False
        ).count()
        
        pending_patients = total_patients - approved_patients
        
        active_meal_plans = MealPlan.objects.filter(
            end_date__gte=request.user.profile.user.date_joined.date()
        ).count()
        
        return Response({
            'total_patients': total_patients,
            'approved_patients': approved_patients,
            'pending_patients': pending_patients,
            'active_meal_plans': active_meal_plans,
        })


class NutritionistNoteViewSet(viewsets.ModelViewSet):
    """
    Manage nutritionist notes for patients.
    """
    serializer_class = NutritionistNoteSerializer
    permission_classes = [IsNutritionist]

    def get_queryset(self):
        # Nutritionists can only see their own notes
        return NutritionistNote.objects.filter(nutritionist=self.request.user)

    def perform_create(self, serializer):
        # Automatically set the nutritionist to the current user
        serializer.save(nutritionist=self.request.user)


class NutritionistRecentActivityView(APIView):
    """
    Get recent activity from all patients (food logs, weekly updates, lab results).
    """
    permission_classes = [IsNutritionist]

    def get(self, request):
        from datetime import datetime, timedelta
        from django.utils import timezone
        
        # Get activity from the last 7 days
        week_ago = timezone.now() - timedelta(days=7)
        
        # Get recent food logs
        recent_food_logs = FoodLog.objects.filter(
            created_at__gte=week_ago,
            user__profile__is_nutritionist=False
        ).select_related('user').order_by('-created_at')[:10]
        
        # Get recent weekly updates
        recent_updates = WeeklyUpdate.objects.filter(
            date__gte=week_ago.date(),
            user__profile__is_nutritionist=False
        ).select_related('user').order_by('-date')[:10]
        
        # Get recent lab results
        recent_labs = LabResult.objects.filter(
            uploaded_at__gte=week_ago,
            user__profile__is_nutritionist=False
        ).select_related('user').order_by('-uploaded_at')[:10]
        
        # Combine and format activities
        activities = []
        
        for log in recent_food_logs:
            activities.append({
                'type': 'food_log',
                'patient': log.user.username,
                'patient_id': log.user.id,
                'content': f"{log.meal_type} - {log.content[:50]}...",
                'timestamp': log.created_at,
                'date': log.date
            })
        
        for update in recent_updates:
            activities.append({
                'type': 'weekly_update',
                'patient': update.user.username,
                'patient_id': update.user.id,
                'content': f"Weight: {update.current_weight}kg",
                'timestamp': datetime.combine(update.date, datetime.min.time()).replace(tzinfo=timezone.get_current_timezone()),
                'date': update.date
            })
        
        for lab in recent_labs:
            activities.append({
                'type': 'lab_result',
                'patient': lab.user.username,
                'patient_id': lab.user.id,
                'content': lab.title,
                'timestamp': lab.uploaded_at,
                'date': lab.uploaded_at.date()
            })
        
        # Sort by timestamp
        activities.sort(key=lambda x: x['timestamp'], reverse=True)
        
        return Response(activities[:20])


class NutritionistPatientProgressView(APIView):
    """
    Get patient progress data for charts (weight over time, measurements, etc.).
    """
    permission_classes = [IsNutritionist]

    def get(self, request, patient_id):
        try:
            patient = User.objects.get(
                id=patient_id,
                profile__is_nutritionist=False
            )
        except User.DoesNotExist:
            return Response(
                {'error': 'Patient not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Get all weekly updates for the patient
        updates = WeeklyUpdate.objects.filter(
            user=patient
        ).order_by('date')
        
        # Format data for charts
        progress_data = {
            'weight': [],
            'measurements': {
                'waist': [],
                'hips': [],
                'chest': [],
                'arm': [],
                'thigh': []
            },
            'energy_levels': [],
            'compliance': []
        }
        
        for update in updates:
            date_str = update.date.isoformat()
            
            if update.current_weight:
                progress_data['weight'].append({
                    'date': date_str,
                    'value': float(update.current_weight)
                })
            
            if update.waist_cm:
                progress_data['measurements']['waist'].append({
                    'date': date_str,
                    'value': float(update.waist_cm)
                })
            
            if update.hips_cm:
                progress_data['measurements']['hips'].append({
                    'date': date_str,
                    'value': float(update.hips_cm)
                })
            
            if update.chest_cm:
                progress_data['measurements']['chest'].append({
                    'date': date_str,
                    'value': float(update.chest_cm)
                })
            
            if update.arm_cm:
                progress_data['measurements']['arm'].append({
                    'date': date_str,
                    'value': float(update.arm_cm)
                })
            
            if update.thigh_cm:
                progress_data['measurements']['thigh'].append({
                    'date': date_str,
                    'value': float(update.thigh_cm)
                })
            
            if update.energy_level:
                progress_data['energy_levels'].append({
                    'date': date_str,
                    'value': update.energy_level
                })
            
            if update.compliance_score:
                progress_data['compliance'].append({
                    'date': date_str,
                    'value': update.compliance_score
                })
        
        return Response(progress_data)
