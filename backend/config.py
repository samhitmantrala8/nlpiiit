import os
from dotenv import load_dotenv

load_dotenv() 

MONGO_URI = os.getenv("MONGO_URI") or 'your-fallback-uri'
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
