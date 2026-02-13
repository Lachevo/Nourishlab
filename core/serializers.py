from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, MealPlan, WeeklyUpdate

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['age', 'height', 'weight', 'goals', 'dietary_prefs', 'allergies', 'is_approved']
        read_only_fields = ['is_approved']

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
