from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from .models import Profile

class UserTests(APITestCase):
    def test_registration(self):
        """
        Ensure we can create a new account object.
        """
        url = reverse('register')
        data = {'username': 'testuser', 'email': 'test@example.com', 'password': 'strongpassword123'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'testuser')
        self.assertTrue(Profile.objects.filter(user__username='testuser').exists())

    def test_login(self):
        """
        Ensure we can login and get a JWT token.
        """
        # Create user
        user = User.objects.create_user(username='testuser', password='strongpassword123')

        url = reverse('token_obtain_pair')
        data = {'username': 'testuser', 'password': 'strongpassword123'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_profile_access(self):
        """
        Ensure authenticated user can access their profile.
        """
        user = User.objects.create_user(username='testuser', password='strongpassword123')
        profile = user.profile
        profile.height = 180
        profile.weight = 75
        profile.save()
        
        # Login
        login_url = reverse('token_obtain_pair')
        login_data = {'username': 'testuser', 'password': 'strongpassword123'}
        login_response = self.client.post(login_url, login_data, format='json')
        access_token = login_response.data['access']

        # Access Profile
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)
        url = reverse('profile')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')
        self.assertEqual(response.data['profile']['height'], 180.0)
