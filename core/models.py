from django.db import models
from django.contrib.auth.models import User
from ckeditor.fields import RichTextField

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    age = models.IntegerField(null=True, blank=True)
    height = models.FloatField(help_text="Height in cm", null=True, blank=True)
    weight = models.FloatField(help_text="Weight in kg", null=True, blank=True)
    goals = models.TextField(blank=True)
    dietary_prefs = models.TextField(blank=True, help_text="Vegetarian, Vegan, etc.")
    allergies = models.TextField(blank=True)
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username}'s Profile"

class MealPlan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='meal_plans')
    start_date = models.DateField()
    end_date = models.DateField()
    content = RichTextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Meal Plan for {self.user.username} ({self.start_date} to {self.end_date})"

class WeeklyUpdate(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='weekly_updates')
    date = models.DateField(auto_now_add=True)
    current_weight = models.FloatField()
    notes = models.TextField(blank=True)
    # photos = models.ImageField(upload_to='updates/', blank=True, null=True) # Uncomment if handling file uploads

    def __str__(self):
        return f"Update by {self.user.username} on {self.date}"
