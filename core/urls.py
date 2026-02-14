from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from . import views

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
    path('messages/mark_read/', views.MessageViewSet.as_view({'post': 'mark_read'}), name='messages_mark_read'),
    path('messages/conversations/', views.ConversationListView.as_view(), name='conversation_list'),
    path('nutritionists/', views.NutritionistView.as_view(), name='nutritionists'),
    path('lab-results/', views.LabResultViewSet.as_view(), name='lab_results'),
]
