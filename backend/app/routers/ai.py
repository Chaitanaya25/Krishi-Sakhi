"""
AI Router for Krishi Sakhi - Ollama Integration
Provides AI-powered farming advisories using Ollama LLM API

Example curl requests to test endpoints:

# Generate AI advisory for farmer
curl -X POST http://localhost:8000/ai/advise/1

# Chat with AI about farming
curl -X POST http://localhost:8000/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"question":"What to do after rain?", "farmer_id":1}'
"""

import requests
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from ..db import get_db
from ..models.farmer import Farmer
from ..models.advisory import Advisory
from ..schemas.advisory import AdvisoryOut
from ..schemas.ai import ChatRequest, ChatResponse

router = APIRouter(prefix="/ai", tags=["ai"])

# Ollama API configuration
OLLAMA_API_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "llama3"


def call_ollama(prompt: str) -> str:
    """
    Call Ollama API to generate AI response
    """
    try:
        payload = {"model": OLLAMA_MODEL, "prompt": prompt, "stream": False}

        response = requests.post(OLLAMA_API_URL, json=payload, timeout=30)
        response.raise_for_status()

        result = response.json()
        return result.get("response", "Sorry, I couldn't generate a response.")

    except requests.exceptions.ConnectionError:
        raise HTTPException(
            status_code=503,
            detail="Ollama service is not running. Please start Ollama on http://localhost:11434",
        )
    except requests.exceptions.Timeout:
        raise HTTPException(
            status_code=504,
            detail="Ollama service request timed out. The model may be busy or overloaded.",
        )
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Ollama API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


def build_farmer_prompt(farmer: Farmer) -> str:
    """
    Build a context-rich prompt using farmer's profile data
    """
    prompt_parts = [
        f"Farmer: {farmer.name}",
        (
            f"Location: {farmer.latitude}, {farmer.longitude}"
            if farmer.latitude and farmer.longitude
            else "Location: Not specified"
        ),
        (
            f"Land size: {farmer.land_size_ha} hectares"
            if farmer.land_size_ha
            else "Land size: Not specified"
        ),
        (
            f"Soil type: {farmer.soil_type}"
            if farmer.soil_type
            else "Soil type: Not specified"
        ),
        (
            f"Irrigation: {farmer.irrigation_type}"
            if farmer.irrigation_type
            else "Irrigation: Not specified"
        ),
        f"Crops: {farmer.crops}" if farmer.crops else "Crops: Not specified",
    ]

    return ", ".join(prompt_parts)


@router.post("/advise/{farmer_id}", response_model=AdvisoryOut)
async def generate_ai_advisory(farmer_id: int, db: Session = Depends(get_db)):
    """
    Generate AI-powered farming advisory for a specific farmer
    """
    # Fetch farmer from database
    farmer = db.get(Farmer, farmer_id)
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")

    # Build context-rich prompt
    farmer_context = build_farmer_prompt(farmer)

    prompt = f"""You are Krishi Sakhi, a farming advisor. Based on the farmer's profile: {farmer_context}

Please provide 3 short, actionable farming advisories for the next week. Each advisory should be:
- Specific to their crops, soil, and irrigation setup
- Practical and easy to implement
- Under 50 words per advisory

Focus on:
1. Crop management (pest control, fertilization, harvesting)
2. Soil and irrigation optimization
3. Seasonal activities and weather preparation

Keep the total response under 150 words. Be concise and actionable."""

    try:
        # Call Ollama API
        ai_response = call_ollama(prompt)

        # Save advisory to database
        advisory = Advisory(
            farmer_id=farmer.id, text=ai_response, severity="info", source="ai"
        )

        db.add(advisory)
        db.commit()
        db.refresh(advisory)

        return advisory

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to generate advisory: {str(e)}"
        )


@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest, db: Session = Depends(get_db)):
    """
    Chat with AI about farming questions
    """
    # Fetch farmer from database
    farmer = db.get(Farmer, request.farmer_id)
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")

    # Build context-rich prompt
    farmer_context = build_farmer_prompt(farmer)

    prompt = f"""You are Krishi Sakhi, a farming advisor. 

Farmer {request.farmer_id} with profile ({farmer_context}) asked: {request.question}

Please reply in simple farming language that this farmer can easily understand. Be practical and specific to their situation. Keep your response under 100 words and focus on actionable advice."""

    try:
        # Call Ollama API
        ai_answer = call_ollama(prompt)

        return ChatResponse(answer=ai_answer, farmer_id=request.farmer_id)

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to get AI response: {str(e)}"
        )


@router.get("/health")
async def ai_health_check():
    """
    Check if Ollama API is accessible
    """
    try:
        # Simple test call to Ollama
        test_payload = {"model": OLLAMA_MODEL, "prompt": "Hello", "stream": False}

        response = requests.post(OLLAMA_API_URL, json=test_payload, timeout=10)
        response.raise_for_status()

        return {
            "status": "healthy",
            "service": "AI Advisory Service",
            "ollama_status": "connected",
            "model": OLLAMA_MODEL,
        }

    except requests.exceptions.RequestException as e:
        return {
            "status": "unhealthy",
            "service": "AI Advisory Service",
            "ollama_status": "disconnected",
            "error": str(e),
            "suggestion": "Ensure Ollama is running on http://localhost:11434",
        }
    except Exception as e:
        return {"status": "error", "service": "AI Advisory Service", "error": str(e)}
