import firebase_admin
from firebase_admin import credentials, firestore
import os

# Get the absolute path to the credentials file
current_dir = os.path.dirname(os.path.abspath(__file__))
cred_path = os.path.join(current_dir, "firebase_credentials.json")

# Initialize Firebase with the correct path
cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred)

# Get Firestore client
db = firestore.client()

print("Connected to Firestore successfully!")