from rest_framework import permissions

class IsNutritionist(permissions.BasePermission):
    """
    Allows access only to users who are marked as nutritionists.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and hasattr(request.user, 'profile') and request.user.profile.is_nutritionist)
