import resend
import os
from dotenv import load_dotenv

# Load environment variables from .env.local
load_dotenv('.env.local')

# Get API key from environment
api_key = os.getenv('RESEND_API_KEY')

if not api_key:
    print("❌ RESEND_API_KEY not found in .env.local")
    exit(1)

print(f"🔑 Using API key: {api_key[:10]}...")

# Set the API key for the module
resend.api_key = api_key

# List all API keys
try:
    result = resend.ApiKeys.list()
    print("\n✅ API Keys:")
    print(result)
except Exception as e:
    print(f"❌ Error: {e}")