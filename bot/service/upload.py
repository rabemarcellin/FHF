import requests
import os

API_URL = os.getenv("API_URL")

def get_video_part(part_token):
    """Retrieve specific video part details using a part token."""
    url = f"{API_URL}/video/{part_token}"
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise HTTPError for bad responses
        return response.json()  # Return parsed JSON data
    except requests.exceptions.RequestException as e:
        print(f"Error fetching video part: {e}")
        return None
