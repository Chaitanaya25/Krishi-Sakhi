# Krishi Sakhi Setup Guide

## Prerequisites

- Docker and Docker Compose
- Git
- Node.js 20+ (for local development)
- Python 3.12+ (for local development)

## Getting Started

### Using Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/Chaitanaya25/krishi-sakhi.git
   cd krishi-sakhi
   ```

2. Create environment files:
   ```bash
   cp backend/.env.example backend/.env
   ```

3. Start the services:
   ```bash
   docker-compose up
   ```

4. Access the applications:
   - Web UI: http://localhost:3000
   - API: http://localhost:8000

### Local Development

#### Backend (FastAPI)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the development server:
   ```bash
   uvicorn app.main:app --reload
   ```

#### Frontend (Next.js)

1. Navigate to the web directory:
   ```bash
   cd web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Configuration

Refer to the `.env.example` files in both the `backend` and `web` directories for available configuration options.