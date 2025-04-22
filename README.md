# KeelCompass App

## Description

KeelCompass is a Express.js + React.js full stack app. Each component has its own Dockerfile and both are controlled from the docker-compose.yml in the root.

## Getting Started

### Prerequisites

- Docker
- Node.js (optional for local dev, not needed for Docker)
- MySQL

### Instructions

1. Clone the repository.

```bash
git clone git@github.com:keelworks/KeelCompass.git
```

2. On your terminal, activate the mysql server using your username and password. If your username is root, the command is:

```bash
mysql -u root -p
```

3. Create a mysql db for KeelCompass from the mysql server. Then exit the mysql server.

```mysql
create database keelworks_keelcompass_db;
```

4. Create a .env file in backend/. Copy and paste the contents in .env.example into the newly created .env. Replace DB_USER, DB_PASSWORD, and DB_DATABASE variables with your own.

```env
DB_USER=root
DB_PASS=yourpassword
DB_DATABASE=keelworks_keelcompass_db
```

5. On your terminal, cd into the root of the project. Sync your local db using the latest keelcompass_dump_x.x.sql file in backend/database/. For example, if the latest version is keelcompass_dump_3.0.sql, the db name is keelworks_keelcompass_db, and your username is root, the command is:

```bash
mysql -u root -p keelworks_keelcompass_db < backend/database/keelcompass_dump_3.0.sql
```

6. Build and activate the Dockerfiles for both backend/ and frontend/ using docker-compose.yml in the root. From the root, the command is:

```bash
docker compose up --build
```

7. (Optional) If developers want to run components independently (outside of `docker-compose`), they can do so using Docker or local Node.js. On your terminal, go to whichever component you want to run (cd backend or cd frontend) and run these commands:

For backend/Dockerfile

```bash
docker build -t keelcompass-backend .
docker run -p 8080:8080 --envfile .env keelcompass-backend
```

For frontend/Dockerfile

```bash
docker build -t keelcompass-frontend .
docker run -p 5173:5173 keelcompass-frontened
```

For either backend or frontend via local Node.js

```bash
npm install
npm run dev
```
