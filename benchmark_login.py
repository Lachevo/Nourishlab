import requests
import time

URL = "http://localhost:8000/api/auth/login/"
PAYLOAD = {
    "username": "Leul",
    "password": "password123" # Replace with a valid test password if known, otherwise this will result in 401 but still measure time
}

def test_login_speed():
    print(f"Testing login speed at {URL}...")
    start_time = time.time()
    try:
        response = requests.post(URL, json=PAYLOAD)
        end_time = time.time()
        print(f"Status Code: {response.status_code}")
        print(f"Response Time: {end_time - start_time:.4f} seconds")
        print(f"Response Body: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_login_speed()
