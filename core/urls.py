from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from . import views
from . import nutritionist_views

urlpatterns = [
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('meal-plans/', views.MealPlanListView.as_view(), name='meal_plans'),
    path('meal-plans/<int:pk>/', views.MealPlanDetailView.as_view(), name='meal_plan_detail'),
    path('weekly-updates/', views.WeeklyUpdateView.as_view(), name='weekly_updates'),
    path('weight-history/', views.WeightHistoryView.as_view(), name='weight_history'),
    path('social-progress/', views.SocialProgressView.as_view(), name='social_progress'),
    path('auth/google/', views.GoogleLogin.as_view(), name='google_login'),
    
    path('recipes/', views.RecipeListView.as_view(), name='recipe_list'),
    path('recipes/<int:pk>/', views.RecipeViewSet.as_view(), name='recipe_detail'),
    
    path('food-logs/', views.FoodLogViewSet.as_view(), name='food_logs'),
    path('messages/', views.MessageViewSet.as_view({'get': 'list', 'post': 'create'}), name='messages'),
    path('messages/mark_read/', views.MessageViewSet.as_view({'post': 'mark_conversation_read'}), name='messages_mark_read'),
    # path('messages/conversations/', views.ConversationListView.as_view(), name='conversation_list'),
    path('nutritionists/', views.NutritionistView.as_view(), name='nutritionists'),
    path('lab-results/', views.LabResultViewSet.as_view(), name='lab_results'),
    
    # Nutritionist-specific endpoints
    path('nutritionist/patients/', nutritionist_views.NutritionistPatientListView.as_view(), name='nutritionist_patients'),
    path('nutritionist/patients/<int:pk>/', nutritionist_views.NutritionistPatientDetailView.as_view(), name='nutritionist_patient_detail'),
    path('nutritionist/patients/<int:patient_id>/progress/', nutritionist_views.NutritionistPatientProgressView.as_view(), name='nutritionist_patient_progress'),
    path('nutritionist/meal-plans/', nutritionist_views.NutritionistMealPlanViewSet.as_view({'get': 'list', 'post': 'create'}), name='nutritionist_meal_plans'),
    path('nutritionist/meal-plans/<int:pk>/', nutritionist_views.NutritionistMealPlanViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='nutritionist_meal_plan_detail'),
    path('nutritionist/templates/', nutritionist_views.NutritionistMealPlanTemplateViewSet.as_view({'get': 'list', 'post': 'create'}), name='nutritionist_templates'),
    path('nutritionist/templates/<int:pk>/', nutritionist_views.NutritionistMealPlanTemplateViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='nutritionist_template_detail'),
    path('nutritionist/stats/', nutritionist_views.NutritionistDashboardStatsView.as_view(), name='nutritionist_stats'),
    path('nutritionist/notes/', nutritionist_views.NutritionistNoteViewSet.as_view({'get': 'list', 'post': 'create'}), name='nutritionist_notes'),
    path('nutritionist/notes/<int:pk>/', nutritionist_views.NutritionistNoteViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='nutritionist_note_detail'),
    path('nutritionist/recent-activity/', nutritionist_views.NutritionistRecentActivityView.as_view(), name='nutritionist_recent_activity'),
]
