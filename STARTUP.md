# 🚀 Krishi Sakhi Project Startup Guide

## Quick Start

### Option 1: Use the Main Startup Script (Recommended)
```bash
# Windows Batch
start_project.bat

# Windows PowerShell
.\start_project.ps1
```

### Option 2: Start Servers Manually

#### Backend Server (Port 8000)
```bash
cd backend
start.bat
```
- **API Base URL**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Interactive API Docs**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

#### Frontend Server (Port 3000)
```bash
cd web
start.bat
```
- **Frontend URL**: http://localhost:3000

## 📚 API Documentation

Once the backend is running, you can access:

- **Swagger UI**: http://localhost:8000/docs
  - Interactive API documentation
  - Test endpoints directly from the browser
  - View request/response schemas

- **ReDoc**: http://localhost:8000/redoc
  - Alternative documentation view
  - Cleaner, more readable format

## 🤖 AI Endpoints

The AI service provides intelligent farming advice:

- **Generate Advisory**: `POST /ai/advise/{farmer_id}`
  - Creates personalized farming advice based on farmer profile
  - Saves advisory to database with source="ai"

- **AI Chat**: `POST /ai/chat`
  - Chat with AI about farming questions
  - Uses farmer context for personalized responses

- **AI Health**: `GET /ai/health`
  - Check if Ollama service is accessible
  - Verify AI model availability

## 🔧 Available Endpoints

- **Root**: `GET /` - Service status
- **Health**: `GET /health` - Health check
- **Database**: `GET /db-status` - Database connection status
- **Farmers**: `/farmers/*` - Farmer management
- **Activities**: `/activities/*` - Activity logging
- **Advisories**: `/advisories/*` - Farming advice
- **AI Advisory**: `/ai/*` - AI-powered farming advice using Ollama
- **Geolocation**: `/geolocation/*` - Location services
- **Webhook**: `/webhook/*` - WhatsApp integration

## 🐛 Troubleshooting

### Backend Issues
1. Check if virtual environment is activated
2. Ensure dependencies are installed: `pip install -r requirements.txt`
3. Check database: `python manage_db.py inspect`
4. Reset database if needed: `python manage_db.py reset`

### AI Service Issues
1. Ensure Ollama is installed and running on http://localhost:11434
2. Install the required model: `ollama pull llama3`
3. Test AI endpoints: `python test_ai.py`
4. Check AI health: `GET /ai/health`

### Frontend Issues
1. Ensure Node.js is installed
2. Install dependencies: `npm install`
3. Check for port conflicts on 3000

### Port Conflicts
- Backend: Change port in `backend/app/config.py` (API_PORT)
- Frontend: Change port in `web/package.json` scripts

## 📁 Project Structure
```
Krishi Sakhi/
├── backend/          # FastAPI backend (Port 8000)
├── web/             # Next.js frontend (Port 3000)
├── start_project.bat    # Windows batch startup
├── start_project.ps1    # PowerShell startup
└── STARTUP.md       # This file
```

## 🌟 Features
- **FastAPI Backend**: Modern, fast Python web framework
- **Next.js Frontend**: React-based frontend with TypeScript
- **SQLite Database**: Lightweight database for development
- **Auto-generated API Docs**: Swagger UI and ReDoc
- **AI-Powered Advisories**: Ollama integration for intelligent farming advice
- **CORS Enabled**: Frontend can communicate with backend
- **Hot Reload**: Both servers support development mode
