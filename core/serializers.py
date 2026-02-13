from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, MealPlan, WeeklyUpdate

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['age', 'height', 'weight', 'goals', 'dietary_prefs', 'allergies', 'is_approved']
        read_only_fields = ['is_approved']
    
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
        fields = ['id', 'username', 'email', 'password', 'profile']

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )

class MealPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = MealPlan
        fields = ['id', 'start_date', 'end_date', 'content', 'created_at']

class WeeklyUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeeklyUpdate
        fields = ['id', 'date', 'current_weight', 'notes']
        read_only_fields = ['date']
