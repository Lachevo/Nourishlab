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
    path('auth/google/', views.GoogleLogin.as_view(), name='google_login'),
]
