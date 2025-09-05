# Krishi Sakhi - Setup Instructions

> **Note**: This project uses a simplified database approach without complex migrations. 
> Simply run `manage_db.bat reset` to recreate the database when needed.

## Prerequisites
- Python 3.8+ 
- Node.js 18+ and npm
- Git

## Backend Setup (FastAPI)

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Activate virtual environment
**Windows:**
```bash
.venv\Scripts\activate
```

**macOS/Linux:**
```bash
source .venv/bin/activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Database Setup (IMPORTANT!)
The project now uses a simple database approach. You have two options:

#### Option A: Reset and recreate database (recommended for development)
```bash
# Windows
manage_db.bat reset

# Or manually
python manage_db.py reset
```

#### Option B: Check database status
```bash
# Check if database exists and has tables
python manage_db.py inspect

# Or check via API endpoint
curl http://localhost:8000/db-status
```

### 5. Start FastAPI server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at:
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Interactive API: http://localhost:8000/redoc
- Health Check: http://localhost:8000/health
- Database Status: http://localhost:8000/db-status

## Frontend Setup (Next.js)

### 1. Navigate to web directory
```bash
cd web
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```

The frontend will be available at: http://localhost:3000

## Environment Variables

### Backend (.env file in backend/ directory)
```bash
# Database
DATABASE_URL=sqlite:///./krishisakhi.db

# CORS
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Optional: IPinfo token for better geolocation
IPINFO_TOKEN=your_token_here
```

### Frontend (.env.local file in web/ directory)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Database Management

### Quick Commands (Windows)
```bash
# Reset database (removes all data and recreates tables)
manage_db.bat reset

# Inspect current database schema and data
manage_db.bat inspect

# Show help
manage_db.bat help
```

### Manual Commands
```bash
# Activate virtual environment first
.venv\Scripts\activate

# Reset database
python manage_db.py reset

# Inspect database
python manage_db.py inspect

# Show help
python manage_db.py help
```

### Simple Database Operations
- **Reset**: Removes database file and recreates all tables
- **Inspect**: Shows current database schema and sample data
- **No migrations**: Simple approach - just recreate tables when needed

## Quick Start

1. **Terminal 1 - Backend:**
   ```bash
   cd backend
   .venv\Scripts\activate  # Windows
   manage_db.bat reset      # Set up database
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   cd web
   npm run dev
   ```

3. Open http://localhost:3000 in your browser

## Project Structure

```
krishi-sakhi/
├── backend/                 # FastAPI backend
│   ├── app/                # Application code
│   ├── tools/              # Database management tools
│   │   └── manage_db.py    # Simple database script
│   ├── .venv/              # Python virtual environment
│   ├── manage_db.py        # Main database management script
│   ├── manage_db.bat       # Windows database management
│   ├── start.bat           # Windows startup script
│   ├── start.ps1           # PowerShell startup script
│   └── requirements.txt    # Python dependencies
├── web/                    # Next.js frontend
│   ├── src/                # Source code
│   ├── package.json        # Node.js dependencies
│   ├── start.bat           # Windows startup script
│   └── tailwind.config.ts  # Tailwind CSS config
└── docker-compose.yml      # Docker setup (optional)
```

## Features

- **Farmer Profile Management**: Create and manage farmer profiles with GPS location
- **AI Advisor**: Get AI-powered farming advice based on weather and location
- **Activity Logging**: Track farming activities
- **Advisory Feed**: View saved farming advisories
- **Geolocation**: Automatic location detection with GPS fallback to IP
- **Simple Database**: Easy database management without complex migrations

## Troubleshooting

### Backend Issues
- Ensure virtual environment is activated
- Check if port 8000 is available
- Verify all dependencies are installed
- **Database Issues**: Run `manage_db.bat reset` to recreate database

### Frontend Issues
- Clear browser cache
- Check if port 3000 is available
- Verify backend is running on port 8000

### Database Issues
- **Tables missing**: Run `manage_db.bat reset` or `manage_db.bat migrate`
- **Migration errors**: Check `alembic history` and resolve conflicts
- **Data loss**: `manage_db.bat reset` will remove all data - use with caution

### Geolocation Issues
- Ensure HTTPS in production (GPS requires secure context)
- Check browser permissions for location access
- Verify IP geolocation fallback is working

## Testing Geolocation

### Backend Geolocation Test
Test if the IP geolocation services are working:
```bash
# Test geolocation services
curl http://localhost:8000/geo/test

# Test IP geolocation
curl http://localhost:8000/geo/ip
```

### Frontend Geolocation Test
1. Open the Farmer Profile form in your browser
2. Click "Get My Location" button
3. Check browser console for detailed logs
4. Verify coordinates are auto-filled in latitude/longitude fields

### Geolocation Troubleshooting
- **GPS not working**: Ensure HTTPS in production, check browser permissions
- **IP geolocation failing**: Check internet connection, verify backend is running
- **Coordinates not filling**: Check browser console for errors, verify API responses

## Development Workflow

### Making Database Changes
1. Modify models in `backend/app/models/`
2. Reset database: `python manage_db.py reset`
3. Tables are automatically recreated with new schema

### Testing Database
- Use `manage_db.bat inspect` to view current schema and data
- Use `manage_db.bat reset` to start fresh during development
- Check `/db-status` endpoint for database health
