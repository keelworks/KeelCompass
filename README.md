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

2. Go into the repository and navigate to the backend. Install cross-env as a dev dependency.

```bash
cd KeelCompass
cd backend
npm install --save-dev cross-env
```

3. On your terminal, activate the mysql server using your username and password. If your username is root, the command is:

```bash
mysql -u root -p
```

4. Create a mysql db for KeelCompass from the mysql server. Then exit the mysql server.

```mysql
create database keelworks_keelcompass_db;
```

5. Set up backend environment variables.

- For development mode, create a .env file in backend/. Copy and paste the contents in .env.example into the newly created .env. Replace DB_USER, DB_PASSWORD, and DB_DATABASE variables with your own local database configurations.

```env
DB_USER=root
DB_PASS=yourpassword
DB_DATABASE=keelworks_keelcompass_db
```

<!-- - For testing/production mode, create a .env.production file in backend/. Copy and paste the contents in .env.example into the newly created .env. Replace DB_USER, DB_PASSWORD, and DB_DATABASE variables with the current testing/production database configurations. -->

6. Set up frontenv environment variables.

- For development mode, create a .env file in frontend/. Copy and paste the contents in .env.example into the newly created .env.

<!-- - For testing/production mode, create a .env.production in frontend/. Copy and paste the contents in .env.example into the newly created .env. Replace VITE_API_URL to the correct base url for this environment. -->

7. On your terminal, cd into the backend and start the backend once to sync the database schema.

```bash
cd KeelCompass
cd backend
npm install
npm run dev
```

8. Once the backend logs "Databse synced", stop the server and seed using the latest seed file inside backend/database/. For example, if the latest version is seed_3.1.js, the db name is keelworks_keelcompass_db, and your username is root, the command from the backend/ directory is:

```bash
node database/seed_3.1.js
```

9. Build and activate the Dockerfiles for both backend/ and frontend/ using docker-compose.yml in the root. From the root, the command is:

```bash
cd KeelCompass
docker compose up --build
```

10. (Optional) If developers want to run components independently (outside of `docker-compose`), they can do so using Docker or local Node.js. On your terminal, go to whichever component you want to run (cd backend or cd frontend) and run these commands:

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
