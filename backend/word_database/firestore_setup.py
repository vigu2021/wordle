import firebase_admin
from firebase_admin import credentials, firestore

# Path to your Firebase credentials JSON file
cred = credentials.Certificate("firebase_credentials.json")

# Initialize Firebase app
firebase_admin.initialize_app(cred)

# Get Firestore client
db = firestore.client()

print("Connected to Firestore successfully!")
