# KeelCompass App

## Description

KeelCompass is a Express.js + React.js full stack app. Each component has its own Dockerfile and both are controlled from the docker-compose.yml in the root.

## Getting Started

### Prerequisites

- Docker
- Node.js (optional for local dev, not needed for Docker)
- MySQL

### Initial Setup

1. Clone the repository.

```bash
git clone git@github.com:keelworks/KeelCompass.git
```

### Running in Development Environment

In development mode, the app connects to the local MySQL database on your computer.

1. Open a new terminal and activate the mysql shell using your username and password. If your username is root, the command is:

```bash
mysql -u root -p
```

2. Create a mysql db for KeelCompass from the mysql shell.

```mysql
create database keelworks_keelcompass_db;
```

Exit the mysql shell once database is created.

3. Create a .env file in backend/. Copy and paste the contents in .env.example into the newly created .env. Replace DB_USER, DB_PASSWORD, and DB_DATABASE variables with your own local database configurations.

4. Create a .env file in frontend/. Copy and paste the contents in .env.example into the newly created .env.

5. On the terminal, navigate to the backend and run the following commands to start the backend server.

```bash
cd KeelCompass/backend
npm install
npm install --save-dev cross-env
npm run dev
```

Backend should now be running successfully on one terminal.

6. Open a new terminal, navigate to the backend and seed using the latest seed file inside backend/database/. For example, if the latest version is seed_3.1.js, the command is:

```bash
cd KeelCompass/backend
node database/seed_3.1.js
```

7. On the terminal, navigate to the frontend and run the following commands to start the frontend server.

```bash
cd KeelCompass/frontend
npm install
npm run dev
```

App should be available on the browser at http://localhost:5173.

8. Alternatively, you can run the app using Docker Compose. Instead of running `npm run dev` for the backend and frontend seperately, navigate to the root directory and run docker-compose.yml.

```bash
cd KeelCompass
docker compose up --build
```

App should be available on the browser at http://localhost:5173.

### Running in Testing Environment

In testing mode, the app uses Dockerized MySQL (defined in docker-compose.testing.yml). This setup is fully containerized and does not use your local MySQL server.

1. Create a .env.testing file in backend/. Copy and paste the contents in .env.testing.example into the newly created .env.

2. Create a .env file in frontend/. Copy and paste the contents in .env.example into the newly created .env.

3. On the terminal, navigate to the root directory and run docker-compose.testing.yml.

```bash
cd KeelCompass
docker compose -f docker-compose.testing.yml up --build
```

4. Open a new terminal and seed the Docker database using the latest seed file inside backend/database/. For example, if the latest version is seed_3.1.js, the command is:

```bash
docker compose -f docker-compose.testing.yml exec backend node database/seed_3.1.js
```

App should be available on the browser at http://localhost:5173.
