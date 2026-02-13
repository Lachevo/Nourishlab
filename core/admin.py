from django.contrib import admin
from django.shortcuts import render, redirect
from django.urls import path
from django.contrib import messages
from django.utils.html import format_html
from django import forms
from .models import Profile, MealPlan, WeeklyUpdate, MealPlanTemplate

class AssignMealPlanForm(forms.Form):
    template = forms.ModelChoiceField(queryset=MealPlanTemplate.objects.all(), label="Select Meal Plan Template")
    start_date = forms.DateField(widget=forms.DateInput(attrs={'type': 'date'}))

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'is_approved', 'get_groups')
    list_filter = ('is_approved', 'user__groups')
    search_fields = ('user__username', 'user__email')
    actions = ['assign_meal_plan_from_template']

    def get_groups(self, obj):
        return ", ".join([g.name for g in obj.user.groups.all()])
    get_groups.short_description = 'Groups'

    def assign_meal_plan_from_template(self, request, queryset):
        # If form is submitted
        if 'apply' in request.POST:
            form = AssignMealPlanForm(request.POST)
            if form.is_valid():
                template = form.cleaned_data['template']
                start_date = form.cleaned_data['start_date']
                
                # Calculate end date (assuming 7 days for now, or could add duration to template)
                from datetime import timedelta
                end_date = start_date + timedelta(days=6)
                
                count = 0
                for profile in queryset:
                    MealPlan.objects.create(
                        user=profile.user,
                        start_date=start_date,
                        end_date=end_date,
                        content=template.content
                    )
                    count += 1
                
                self.message_user(request, f"Successfully assigned '{template.name}' to {count} users.")
                return redirect(request.get_full_path())
        else:
            form = AssignMealPlanForm()

        return render(request, 'admin/assign_meal_plan_intermediate.html', context={
            'profiles': queryset,
            'form': form,
            'title': 'Assign Meal Plan from Template',
            # Required for admin template context
            'opts': self.model._meta,
            'action_checkbox_name': admin.helpers.ACTION_CHECKBOX_NAME,
        })

    assign_meal_plan_from_template.short_description = "Assign Meal Plan from Template to selected users"

@admin.register(MealPlanTemplate)
class MealPlanTemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)

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
