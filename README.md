
# 🌾 Krishi Sakhi – AI-Powered Personal Farming Assistant

![Main Banner](docs/images/MAIN_PIC.png)

**Krishi Sakhi** is a modern farming assistant that helps farmers manage their activities, get personalized AI-driven advisories, track weather forecasts, and access government schemes — all in one place.  
Built with **FastAPI (backend)** and **Next.js + Tailwind (frontend)** for speed, scalability, and a seamless user experience.  

---

## ✨ Features

- 📋 **Farmer Profile Management** – Manage farmer details, land size, crops, soil type, and irrigation methods.  
- 📑 **Activity Log** – Record and track farming activities such as sowing, irrigation, spraying, pest control, and harvest.  
- 🤖 **AI Advisor** – Get personalized recommendations powered by AI (Ollama AI integration).  
- 🌦 **Weather Advisory** – Access real-time weather forecasts for location-based decision-making.  
- 📢 **Advisory Feed** – Generate and view tailored farming advisories.  
- 🏛 **Government Schemes** – Stay updated on available schemes and benefits.  

---

## 🖥️ Screenshots

### 1. Farmer Profile  
Manage farmer details, land data, and crops.  
![Farmer Profile](docs/images/Home.jpeg)

### 2. AI Advisor  
Get smart advisories, weather updates, and AI chat support.  
![AI Advisor](docs/images/AI.jpeg)

### 3. Activity Log  
Log and monitor farming activities efficiently.  
![Activity Log](docs/images/Activitylog.jpeg)

### 4. Advisory Feed  
Generate personalized advisories per farmer.  
![Advisory Feed](docs/images/Advisory.jpeg)

---

## 🛠️ Tech Stack

**Frontend:**  
- [Next.js](https://nextjs.org/)  
- [Tailwind CSS](https://tailwindcss.com/)  

**Backend:**  
- [FastAPI](https://fastapi.tiangolo.com/)  
- [SQLAlchemy](https://www.sqlalchemy.org/) + Alembic  
- [SQLite / PostgreSQL]  

**Infrastructure:**  
- Docker + Docker Compose  
- GitHub Actions for CI/CD  

**AI/ML (Pluggable):**  
- Ollama AI for smart advisories  

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/krishi-sakhi.git
cd krishi-sakhi
=======
# Krishi Sakhi

A digital farming assistant platform built with FastAPI and Next.js.

## Project Structure

```
krishi-sakhi/
│── backend/         # FastAPI backend
│── web/             # Next.js frontend
│── docs/            # Documentation
│── .github/         # GitHub workflows
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Git

### Quick Start (Docker)

```bash
# Clone the repository
git clone https://github.com/Chaitanaya25/krishi-sakhi.git
cd krishi-sakhi

# Start the services
docker-compose up
```

The applications will be available at:
- Web UI: http://localhost:3000
- API: http://localhost:8000

## Documentation

See the [docs](./docs) directory for more detailed documentation:

- [Setup Guide](./docs/setup_guide.md)
- [API Reference](./docs/api_reference.md)
- [Architecture](./docs/architecture.png)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.powershell
cd "D:\Krishi Sakhi"
>>>>>>> 8344a3f (chore(repo): initial push with backend, frontend, and docs)
