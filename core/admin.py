from django.contrib import admin
from django.shortcuts import render, redirect
from django.urls import path
from django.contrib import messages
from django.utils.html import format_html
from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Profile, MealPlan, WeeklyUpdate, MealPlanTemplate, Recipe, Message, LabResult

class AssignMealPlanForm(forms.Form):
    template = forms.ModelChoiceField(queryset=MealPlanTemplate.objects.all(), label="Select Meal Plan Template")
    start_date = forms.DateField(widget=forms.DateInput(attrs={'type': 'date'}))

class ReplyMessageForm(forms.Form):
    content = forms.CharField(widget=forms.Textarea(attrs={'rows': 4, 'cols': 40}), label="Your Reply")

@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = ('title', 'prep_time_minutes', 'calories', 'created_at')
    search_fields = ('title', 'tags')
    list_filter = ('created_at',)

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'is_approved', 'is_staff_status', 'get_groups')
    list_filter = ('is_approved', 'user__is_staff', 'user__groups')
    search_fields = ('user__username', 'user__email')
    actions = ['assign_meal_plan_from_template', 'toggle_staff_status', 'promote_to_nutritionist']

    def is_staff_status(self, obj):
        try:
            return obj.user.is_staff
        except User.DoesNotExist:
            return False
    is_staff_status.boolean = True
    is_staff_status.short_description = 'Nutritionist/Staff'

    def promote_to_nutritionist(self, request, queryset):
        from django.contrib.auth.models import Group
        group, _ = Group.objects.get_or_create(name='Nutritionists')
        for profile in queryset:
            user = profile.user
            user.is_staff = True
            user.is_active = True
            user.save()
            user.groups.add(group)
            
            profile.is_approved = True
            profile.save()
            
        self.message_user(request, f"Selected users promoted to Nutritionist Group and granted staff access.")
    promote_to_nutritionist.short_description = "Promote to Nutritionist (Staff + Approved + Group)"

    def toggle_staff_status(self, request, queryset):
        for profile in queryset:
            user = profile.user
            user.is_staff = not user.is_staff
            user.save()
        self.message_user(request, "Staff status toggled for selected users.")
    toggle_staff_status.short_description = "Toggle Nutritionist/Staff status"

    def get_groups(self, obj):
        try:
            if obj.user:
                return ", ".join([g.name for g in obj.user.groups.all()])
        except User.DoesNotExist:
            pass
        return "N/A"
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
                        content=template.content,
                        structured_plan=template.structured_plan
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

# Customize standard User admin
try:
    admin.site.unregister(User)
except admin.sites.NotRegistered:
    pass
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    # Use standard list_display but safely
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff')
    list_filter = ('is_staff', 'is_superuser', 'is_active') # Remove 'groups' if it's causing issues
    actions = ['promote_to_nutritionist']

    def promote_to_nutritionist(self, request, queryset):
        from django.contrib.auth.models import Group
        try:
            group, _ = Group.objects.get_or_create(name='Nutritionists')
        except Exception:
            self.message_user(request, "Error: Could not access/create 'Nutritionists' group.", level=messages.ERROR)
            return

        count = 0
        for user in queryset:
            user.is_staff = True
            user.is_active = True
            user.save()
            user.groups.add(group)
            
            # Also approve profile if it exists
            try:
                if hasattr(user, 'profile'):
                    user.profile.is_approved = True
                    user.profile.save()
            except Exception:
                pass # Continue with others if one fails
            count += 1
        self.message_user(request, f"{count} users promoted to Nutritionists.")
    promote_to_nutritionist.short_description = "Promote to Nutritionist Group"

    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related('groups')

@admin.register(WeeklyUpdate)
class WeeklyUpdateAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'current_weight')
    list_filter = ('date',)
    search_fields = ('user__username',)

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'recipient', 'content_snippet', 'timestamp', 'is_read', 'reply_button')
    list_filter = ('timestamp', 'is_read')
    search_fields = ('sender__username', 'recipient__username', 'content')
    actions = ['reply_to_client']

    def content_snippet(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_snippet.short_description = 'Content'

    def reply_button(self, obj):
        from django.urls import reverse
        url = reverse('admin:core_message_reply', args=[obj.pk])
        return format_html('<a class="button" href="{}">Reply</a>', url)
    reply_button.short_description = 'Speed Reply'

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('<path:object_id>/reply/', self.admin_site.admin_view(self.reply_view), name='core_message_reply'),
        ]
        return custom_urls + urls

    def reply_view(self, request, object_id):
        obj = self.get_object(request, object_id)
        if not obj:
            return redirect('admin:core_message_changelist')

        if request.method == 'POST':
            form = ReplyMessageForm(request.POST)
            if form.is_valid():
                content = form.cleaned_data['content']
                Message.objects.create(
                    sender=request.user,
                    recipient=obj.sender,
                    content=content
                )
                self.message_user(request, f"Reply sent to {obj.sender.username}.")
                return redirect('admin:core_message_changelist')
        else:
            form = ReplyMessageForm()

        return render(request, 'admin/reply_message_intermediate.html', context={
            'original_message': obj,
            'form': form,
            'title': 'Reply to Client Message',
            'opts': self.model._meta,
        })

    def reply_to_client(self, request, queryset):
        if queryset.count() != 1:
            self.message_user(request, "Please select exactly one message to reply to.", level=messages.ERROR)
            return
        
        obj = queryset.get()
        
        if 'apply' in request.POST:
            form = ReplyMessageForm(request.POST)
            if form.is_valid():
                content = form.cleaned_data['content']
                Message.objects.create(
                    sender=request.user,
                    recipient=obj.sender, # Reply to the person who sent it
                    content=content
                )
                self.message_user(request, f"Reply sent to {obj.sender.username}.")
                return redirect(request.get_full_path())
        else:
            form = ReplyMessageForm()

        return render(request, 'admin/reply_message_intermediate.html', context={
            'original_message': obj,
            'form': form,
            'title': 'Reply to Client Message',
            'opts': self.model._meta,
            'action_checkbox_name': admin.helpers.ACTION_CHECKBOX_NAME,
        })
    reply_to_client.short_description = "Reply to selected client"

@admin.register(LabResult)
class LabResultAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'uploaded_at')
    search_fields = ('title', 'user__username')
