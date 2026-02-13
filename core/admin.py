from django.contrib import admin
from .models import Profile, MealPlan, WeeklyUpdate

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'is_approved')
    list_filter = ('is_approved',)
    search_fields = ('user__username', 'user__email')

@admin.register(MealPlan)
class MealPlanAdmin(admin.ModelAdmin):
    list_display = ('user', 'start_date', 'end_date', 'created_at')
    list_filter = ('start_date', 'end_date')
    search_fields = ('user__username',)

@admin.register(WeeklyUpdate)
class WeeklyUpdateAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'current_weight')
    list_filter = ('date',)
    search_fields = ('user__username',)
