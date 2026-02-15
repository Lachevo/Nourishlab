from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, MealPlan, WeeklyUpdate, Recipe, MealPlanTemplate, FoodLog, Message, LabResult, NutritionistNote

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['age', 'height', 'weight', 'goals', 'dietary_prefs', 'allergies', 'is_approved', 'is_nutritionist']
        read_only_fields = ['is_approved', 'is_nutritionist']
    
    def validate_age(self, value):
        if value is not None and (value < 10 or value > 120):
            raise serializers.ValidationError("Age must be between 10 and 120")
        return value
    
    def validate_height(self, value):
        if value is not None and (value < 50 or value > 300):
            raise serializers.ValidationError("Height must be between 50 and 300 cm")
        return value
    
    def validate_weight(self, value):
        if value is not None and (value < 20 or value > 500):
            raise serializers.ValidationError("Weight must be between 20 and 500 kg")
        return value

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'profile', 'is_staff']

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )

class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = '__all__'

class MealPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = MealPlan
        fields = ['id', 'start_date', 'end_date', 'content', 'structured_plan', 'file', 'created_at']

class WeeklyUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeeklyUpdate
        fields = ['id', 'date', 'current_weight', 'waist_cm', 'hips_cm', 'chest_cm', 'arm_cm', 'thigh_cm', 'energy_level', 'compliance_score', 'notes', 'photo_front', 'photo_side', 'photo_back']
        read_only_fields = ['date']

class FoodLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodLog
        fields = '__all__'
        read_only_fields = ['created_at', 'user']

class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.SlugRelatedField(read_only=True, slug_field='username')
    recipient = serializers.SlugRelatedField(slug_field='username', queryset=User.objects.all())
    sender_name = serializers.CharField(source='sender.username', read_only=True)
    recipient_name = serializers.CharField(source='recipient.username', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'sender', 'sender_name', 'recipient', 'recipient_name', 'subject', 'content', 'timestamp', 'is_read']
        read_only_fields = ['sender', 'timestamp']

class LabResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabResult
        fields = '__all__'
        read_only_fields = ['uploaded_at', 'user']

class MealPlanTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MealPlanTemplate
        fields = ['id', 'name', 'description', 'content', 'structured_plan', 'created_at']

class NutritionistNoteSerializer(serializers.ModelSerializer):
    nutritionist_name = serializers.CharField(source='nutritionist.username', read_only=True)
    patient_name = serializers.CharField(source='patient.username', read_only=True)
    
    class Meta:
        model = NutritionistNote
        fields = ['id', 'nutritionist', 'nutritionist_name', 'patient', 'patient_name', 'content', 'tags', 'created_at', 'updated_at']
        read_only_fields = ['nutritionist', 'created_at', 'updated_at']
