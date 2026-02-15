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
        try:
            if self.user:
                return f"{self.user.username}'s Profile"
        except User.DoesNotExist:
            pass
        return f"Orphaned Profile (ID: {self.id})"

class Recipe(models.Model):
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='recipes/', blank=True, null=True)
    prep_time_minutes = models.IntegerField(help_text="Preparation time in minutes")
    cook_time_minutes = models.IntegerField(help_text="Cooking time in minutes", null=True, blank=True)
    servings = models.IntegerField(default=1)
    
    # Macros per serving
    calories = models.IntegerField(help_text="Calories per serving")
    protein_g = models.FloatField(help_text="Protein in grams")
    carbs_g = models.FloatField(help_text="Carbs in grams")
    fat_g = models.FloatField(help_text="Fat in grams")

    ingredients = models.TextField(help_text="List of ingredients, one per line")
    instructions = models.TextField(help_text="Step-by-step instructions")
    tags = models.CharField(max_length=500, blank=True, help_text="Comma-separated tags (e.g., Vegan, Keto, Gluten-Free)")

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class MealPlan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='meal_plans')
    start_date = models.DateField()
    end_date = models.DateField()
    content = RichTextField(blank=True, null=True, help_text="Legacy: Rich text content")
    # Structured plan: { "Monday": { "Breakfast": recipe_id, "Lunch": ... } }
    structured_plan = models.JSONField(blank=True, null=True, help_text="JSON structure of the weekly plan")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Meal Plan for {self.user.username} ({self.start_date} to {self.end_date})"

class WeeklyUpdate(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='weekly_updates')
    date = models.DateField(auto_now_add=True)
    current_weight = models.FloatField()
    waist_cm = models.FloatField(null=True, blank=True)
    hips_cm = models.FloatField(null=True, blank=True)
    chest_cm = models.FloatField(null=True, blank=True)
    arm_cm = models.FloatField(null=True, blank=True)
    thigh_cm = models.FloatField(null=True, blank=True)
    energy_level = models.IntegerField(null=True, blank=True, help_text="Energy level from 1-10")
    compliance_score = models.IntegerField(null=True, blank=True, help_text="Self-reported compliance 0-100%")
    notes = models.TextField(blank=True)
    photo_front = models.ImageField(upload_to='progress_photos/', blank=True, null=True)
    photo_side = models.ImageField(upload_to='progress_photos/', blank=True, null=True)
    photo_back = models.ImageField(upload_to='progress_photos/', blank=True, null=True)

    def __str__(self):
        return f"Update by {self.user.username} on {self.date}"

class FoodLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='food_logs')
    date = models.DateField()
    meal_type = models.CharField(max_length=20, choices=[
        ('Breakfast', 'Breakfast'),
        ('Lunch', 'Lunch'),
        ('Dinner', 'Dinner'),
        ('Snack', 'Snack'),
    ])
    content = models.TextField(help_text="Description of food consumed")
    image = models.ImageField(upload_to='food_logs/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Food Journal Entry"
        verbose_name_plural = "Food Journal"

    def __str__(self):
        return f"{self.user.username} - {self.meal_type} - {self.date}"

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Message from {self.sender.username} to {self.recipient.username} at {self.timestamp}"

class LabResult(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lab_results')
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to='lab_results/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.title} - {self.user.username}"

class MealPlanTemplate(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    content = RichTextField(blank=True, null=True)
    structured_plan = models.JSONField(blank=True, null=True, help_text="JSON structure of the template")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
