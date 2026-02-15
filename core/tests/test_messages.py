
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from core.models import Profile, Message

class MessageTests(APITestCase):
    def setUp(self):
        # Create users
        self.nutritionist = User.objects.create_user(username='nutritionist', password='password123')
        self.client_user = User.objects.create_user(username='client', password='password123')
        
        # Update auto-created profiles
        # Note: If signals are not connected in tests or different, getting the profile is safer
        # Assuming signals create profile
        nutritionist_profile = Profile.objects.get(user=self.nutritionist)
        nutritionist_profile.is_nutritionist = True
        nutritionist_profile.save()

        client_profile = Profile.objects.get(user=self.client_user)
        client_profile.is_nutritionist = False
        client_profile.nutritionist = self.nutritionist
        client_profile.save()
        
        # Authenticate as client
        # self.client is the APIClient
        self.client_token = self.get_token(self.client_user)
        self.nutritionist_token = self.get_token(self.nutritionist)

    def get_token(self, user):
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)

    def authenticate_client(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.client_token)

    def authenticate_nutritionist(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.nutritionist_token)

    def test_send_message(self):
        self.authenticate_client()
        url = reverse('messages')
        data = {'recipient': 'nutritionist', 'content': 'Hello doc!', 'subject': 'Test'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Message.objects.count(), 1)
        self.assertEqual(Message.objects.get().content, 'Hello doc!')

    def test_get_messages(self):
        # Create message from nutritionist to client
        Message.objects.create(sender=self.nutritionist, recipient=self.client_user, content="Hi client", subject="Greetings")
        
        self.authenticate_client()
        url = reverse('messages')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should see the message
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['content'], "Hi client")

    def test_mark_conversation_read(self):
        # Create unread messages
        Message.objects.create(sender=self.nutritionist, recipient=self.client_user, content="Msg 1", is_read=False)
        Message.objects.create(sender=self.nutritionist, recipient=self.client_user, content="Msg 2", is_read=False)
        
        self.authenticate_client()
        url = reverse('messages_mark_read')
        data = {'sender_username': 'nutritionist'}
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['updated_count'], 2)
        self.assertFalse(Message.objects.filter(is_read=False).exists())

