import os
import django
from datetime import date, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nourishlab.settings')
django.setup()

from django.contrib.auth.models import User
from core.models import Recipe, MealPlan, Profile

# 1. Create or Get User
username = 'testuser_interactive'
user, created = User.objects.get_or_create(username=username, email='test@example.com')
if created:
    user.set_password('password123')
    user.save()
    Profile.objects.get_or_create(user=user, defaults={'is_approved': True})
    print(f"Created user: {username}")
else:
    print(f"Using existing user: {username}")
    # Ensure profile exists
    Profile.objects.get_or_create(user=user, defaults={'is_approved': True})

# 2. Create Recipe
recipe_title = "Berry Smoothie Bowl"
recipe, created = Recipe.objects.get_or_create(
    title=recipe_title,
    defaults={
        "prep_time_minutes": 5,
        "calories": 320,
        "protein_g": 15,
        "carbs_g": 45,
        "fat_g": 10,
        "ingredients": "Frozen Berries\nBanana\nProtein Powder\nAlmond Milk",
        "instructions": "Blend all ingredients until smooth. Top with granola.",
        "tags": "Breakfast, Vegan, Quick"
    }
)
print(f"Recipe: {recipe.title} (ID: {recipe.id})")

# 3. Create Meal Plan with Structured Data
start_date = date.today()
end_date = start_date + timedelta(days=6)

structured_plan = {
    "Monday": {
        "Breakfast": recipe.id,
        "Lunch": recipe.id # reusing for demo
    },
    "Tuesday": {
        "Breakfast": recipe.id
    }
}

meal_plan = MealPlan.objects.create(
    user=user,
    start_date=start_date,
    end_date=end_date,
    content="<p>Interactive plan test</p>",
    structured_plan=structured_plan
)

print(f"Created Meal Plan ID: {meal_plan.id} for {user.username}")
print(f"Structured Plan: {meal_plan.structured_plan}")
