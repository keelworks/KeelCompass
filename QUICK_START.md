# KeelCompass Quick Start Guide

> **Quick reference for common tasks and commands**

## 🚀 First Time Setup

```bash
# 1. Clone repository
git clone git@github.com:keelworks/KeelCompass.git
cd KeelCompass

# 2. Create database
psql -U postgres
CREATE DATABASE keelworks_keelcompass_db;
\q;

# 3. Backend setup
cd backend
cp .env.example .env
# Edit .env with your database credentials
npm install
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm run dev  # Terminal 1

# 4. Frontend setup
cd ../frontend
cp .env.example .env
# Edit .env with backend URL (default: http://localhost:8080)
npm install
npm run dev  # Terminal 2

# 5. Access application
# Frontend: http://localhost:5173
# Backend: http://localhost:8080
```

## 📦 Common Commands

### Backend

```bash
# Start development server
npm run dev

# Run migrations
npx sequelize-cli db:migrate

# Rollback last migration
npx sequelize-cli db:migrate:undo

# Create new migration
npx sequelize-cli migration:generate --name your-change

# Seed database
npx sequelize-cli db:seed:all

# Undo all seeders
npx sequelize-cli db:seed:undo:all
```

### Frontend

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Docker

```bash
# Start all services
docker compose up --build

# Start with testing config
docker compose -f docker-compose.testing.yml up --build

# Stop services
docker compose down

# Stop and remove volumes
docker compose down --volumes

# View logs
docker compose logs backend
docker compose logs frontend

# Run commands in container
docker compose exec backend npx sequelize-cli db:migrate
```

## 🗄️ Database Commands

```bash
# Reset database (CAUTION: Deletes all data)
psql -U postgres
DROP DATABASE keelworks_keelcompass_db;
CREATE DATABASE keelworks_keelcompass_db;
\q;

cd backend
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```


## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port
# Windows
netstat -ano | findstr :8080
taskkill /PID <pid> /F

# Mac/Linux
lsof -ti:8080 | xargs kill
```

### Database Connection Issues

```bash
# Check PostgreSQL is running
psql -U postgres

# Verify database exists
\l

# Check .env file has correct credentials
```

### Docker Issues

```bash
# Clean restart
docker compose down --volumes --remove-orphans
docker compose up --build
```

### Migration Errors

```bash
# Rollback and retry
npx sequelize-cli db:migrate:undo
npx sequelize-cli db:migrate

# Or reset database (development only)
# See Database Commands above
```

## 📁 Key Files & Locations

### Backend
- **Server entry**: `backend/server.js`
- **App config**: `backend/src/app.js`
- **Routes**: `backend/src/routes/`
- **Models**: `backend/src/models/`
- **Services**: `backend/src/services/`
- **Logs**: `backend/logs/app.log`

### Frontend
- **Entry point**: `frontend/src/main.tsx`
- **App & Routes**: `frontend/src/App.tsx`
- **Pages**: `frontend/src/pages/`
- **Components**: `frontend/src/components/`
- **API client**: `frontend/src/utils/api.ts`
- **Store**: `frontend/src/utils/store.ts`

### Configuration
- **Backend env**: `backend/.env`
- **Frontend env**: `frontend/.env`
- **Docker**: `docker-compose.yml`
- **Testing Docker**: `docker-compose.testing.yml`

_HAPPY CODING!✈️_
