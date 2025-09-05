# Database Management Guide

## Overview

Krishi Sakhi uses **SQLite** as the database with **Alembic** for schema migrations. This provides a robust way to manage database schema changes while maintaining data integrity.

## Database Schema

### Core Tables

1. **farmers** - Farmer profiles with location and farming details
2. **activities** - Farming activity logs linked to farmers
3. **advisories** - AI-generated farming advice linked to farmers

### Schema Details

```sql
-- Farmers table
CREATE TABLE farmers (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    language TEXT,
    latitude REAL,
    longitude REAL,
    land_size_ha REAL,
    soil_type TEXT,
    irrigation_type TEXT,
    crops TEXT,
    created_at DATETIME,
    updated_at DATETIME
);

-- Activities table
CREATE TABLE activities (
    id INTEGER PRIMARY KEY,
    farmer_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    notes TEXT,
    quantity REAL,
    unit TEXT,
    created_at DATETIME,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id)
);

-- Advisories table
CREATE TABLE advisories (
    id INTEGER PRIMARY KEY,
    farmer_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    severity TEXT,
    source TEXT,
    created_at DATETIME,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id)
);
```

## Quick Start

### 1. Reset Database (Development)
```bash
# Windows
manage_db.bat reset

# Manual
python manage_db.py reset
```

### 2. Run Migrations (Production)
```bash
# Windows
manage_db.bat migrate

# Manual
python manage_db.py migrate
```

### 3. Inspect Database
```bash
# Windows
manage_db.bat inspect

# Manual
python manage_db.py inspect
```

## Migration Workflow

### Creating New Migrations

1. **Modify Models**: Update your SQLAlchemy models in `app/models/`
2. **Generate Migration**: 
   ```bash
   python manage_db.py create-migration "description of changes"
   ```
3. **Review Migration**: Check the generated file in `alembic/versions/`
4. **Apply Migration**: 
   ```bash
   python manage_db.py migrate
   ```

### Example: Adding a New Field

```python
# 1. Modify the model (app/models/farmer.py)
class Farmer(Base):
    # ... existing fields ...
    new_field = Column(String, nullable=True)
```

```bash
# 2. Generate migration
python manage_db.py create-migration "add new_field to farmers"

# 3. Apply migration
python manage_db.py migrate
```

## Database Management Commands

### Windows Batch Commands
```bash
manage_db.bat reset          # Reset database and run migrations
manage_db.bat inspect        # Inspect current schema and data
manage_db.bat migrate        # Run pending migrations
manage_db.bat history        # Show migration history
```

### Python Commands
```bash
python manage_db.py reset          # Reset database and run migrations
python manage_db.py inspect        # Inspect current schema and data
python manage_db.py migrate        # Run pending migrations
python manage_db.py create-migration "description"  # Create new migration
python manage_db.py history        # Show migration history
```

### Direct Alembic Commands
```bash
alembic upgrade head         # Apply all pending migrations
alembic downgrade -1         # Rollback one migration
alembic current              # Show current migration
alembic history              # Show migration history
alembic revision --autogenerate -m "description"  # Create migration
```

## Environment Configuration

### Database URL
The database connection is configured in your `.env` file:
```bash
DATABASE_URL=sqlite:///./krishisakhi.db
```

### CORS Settings
```bash
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

## Troubleshooting

### Common Issues

1. **"No module named 'alembic'"**
   ```bash
   pip install alembic
   ```

2. **"Database is locked"**
   - Close any applications using the database
   - Restart the backend server

3. **"Table already exists"**
   ```bash
   manage_db.bat reset
   ```

4. **Migration conflicts**
   ```bash
   # Check current status
   alembic current
   
   # View history
   alembic history
   
   # Reset if needed
   manage_db.bat reset
   ```

### Database Inspection

Use the inspection command to debug database issues:
```bash
manage_db.bat inspect
```

This will show:
- All tables and their schemas
- Row counts for each table
- Sample data from each table

### Health Check Endpoints

The API provides database health endpoints:
- `GET /health` - Basic service health
- `GET /db-status` - Database connection and table status

## Development vs Production

### Development
- Use `manage_db.bat reset` frequently to start fresh
- Database file is in the project directory
- SQLite for simplicity

### Production
- Use `manage_db.bat migrate` to apply changes
- Consider PostgreSQL for better performance
- Backup database before migrations
- Test migrations on staging first

## Backup and Recovery

### Backup Database
```bash
# Copy the SQLite file
cp krishisakhi.db krishisakhi.db.backup

# Or use SQLite dump
sqlite3 krishisakhi.db .dump > backup.sql
```

### Restore Database
```bash
# Restore from file
cp krishisakhi.db.backup krishisakhi.db

# Or restore from dump
sqlite3 krishisakhi.db < backup.sql
```

## Testing

### Run Setup Tests
```bash
python test_setup.py
```

This will verify:
- All imports work correctly
- Database connection is successful
- Alembic setup is complete
- Environment is configured

## File Structure

```
backend/
├── alembic/                    # Migration system
│   ├── versions/              # Migration files
│   ├── env.py                 # Migration environment
│   └── script.py.mako         # Migration template
├── app/
│   ├── models/                # SQLAlchemy models
│   └── db.py                  # Database connection
├── alembic.ini                # Alembic configuration
├── manage_db.py               # Database management script
├── manage_db.bat              # Windows management script
├── test_setup.py              # Setup verification
└── krishisakhi.db             # SQLite database file
```

## Best Practices

1. **Always backup before migrations**
2. **Test migrations on development first**
3. **Use descriptive migration messages**
4. **Review auto-generated migrations**
5. **Keep migrations small and focused**
6. **Document schema changes**
7. **Use transactions for complex migrations**
