import requests
import json

url = "http://localhost:8000/api/auth/google/"
payload = {
    "access_token": "mock_id_token",
    "id_token": "mock_id_token"
}

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
