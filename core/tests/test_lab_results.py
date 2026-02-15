
import os
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from core.models import LabResult

class LabResultTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testclient', password='password123')
        self.token = self.get_token(self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

    def get_token(self, user):
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)

    def test_upload_lab_result(self):
        url = reverse('lab_results')
        file_content = b"file_content"
        file = SimpleUploadedFile("test_file.txt", file_content, content_type="text/plain")
        
        data = {
            'title': 'Test Lab Result',
            'description': 'Description',
            'file': file
        }
        
        # multipart/form-data is correctly handled by Django test client
        response = self.client.post(url, data, format='multipart')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(LabResult.objects.count(), 1)
        self.assertEqual(LabResult.objects.get().title, 'Test Lab Result')
