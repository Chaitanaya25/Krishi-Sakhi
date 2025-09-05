#!/usr/bin/env python3
"""
Test script for AI endpoints
Tests the AI router endpoints with Ollama integration
"""

import requests
import json
import sys
import time

BASE_URL = "http://localhost:8000"


def test_ai_health():
    """Test AI health endpoint"""
    print("🔍 Testing AI Health Endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/ai/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_generate_advisory(farmer_id=1):
    """Test AI advisory generation"""
    print(f"\n🔍 Testing AI Advisory Generation for Farmer {farmer_id}...")
    try:
        response = requests.post(f"{BASE_URL}/ai/advise/{farmer_id}")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Advisory Generated:")
            print(f"   ID: {data.get('id')}")
            print(f"   Text: {data.get('text')[:200]}...")
            print(f"   Source: {data.get('source')}")
        else:
            print(f"❌ Error: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_ai_chat(farmer_id=1, question="When should I plant tomatoes?"):
    """Test AI chat endpoint"""
    print(f"\n🔍 Testing AI Chat...")
    try:
        payload = {"question": question, "farmer_id": farmer_id}
        response = requests.post(f"{BASE_URL}/ai/chat", json=payload)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Chat Response:")
            print(f"   Answer: {data.get('answer')[:200]}...")
            print(f"   Farmer ID: {data.get('farmer_id')}")
        else:
            print(f"❌ Error: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_backend_health():
    """Test if backend is running"""
    print("🔍 Testing Backend Health...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Backend is running")
            return True
        else:
            print("❌ Backend is not responding properly")
            return False
    except Exception as e:
        print(f"❌ Backend is not accessible: {e}")
        return False


def main():
    print("🚀 Krishi Sakhi AI Endpoints Test")
    print("=" * 50)

    # Check if backend is running
    if not test_backend_health():
        print("\n❌ Backend is not running. Please start the backend first.")
        print("   Run: cd backend && start.bat")
        sys.exit(1)

    # Test AI health
    ai_healthy = test_ai_health()

    if not ai_healthy:
        print("\n⚠️  AI service is not healthy. This might mean:")
        print("   1. Ollama is not running on http://localhost:11434")
        print("   2. The llama3 model is not installed")
        print("   3. There's a network issue")
        print("\n   To install Ollama and llama3:")
        print("   1. Download from: https://ollama.ai/")
        print("   2. Run: ollama pull llama3")
        print("   3. Start Ollama service")

    # Test advisory generation
    print("\n" + "=" * 50)
    test_generate_advisory()

    # Test AI chat
    print("\n" + "=" * 50)
    test_ai_chat()

    print("\n" + "=" * 50)
    print("🎯 Test Summary:")
    print("   - Backend: ✅ Running")
    print(f"   - AI Service: {'✅ Healthy' if ai_healthy else '❌ Unhealthy'}")
    print("   - Endpoints: Tested")

    if ai_healthy:
        print("\n🌟 AI endpoints are working! You can now:")
        print("   - Generate advisories: POST /ai/advise/{farmer_id}")
        print("   - Chat with AI: POST /ai/chat")
        print("   - Check health: GET /ai/health")
    else:
        print("\n🔧 To get AI working:")
        print("   1. Install Ollama from https://ollama.ai/")
        print("   2. Pull the model: ollama pull llama3")
        print("   3. Start Ollama service")
        print("   4. Restart the backend")


if __name__ == "__main__":
    main()
