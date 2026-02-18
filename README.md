# KeelCompass App

## Description

KeelCompass is a Express.js + React.js full stack app. Each component has its own Dockerfile and both are controlled from the docker-compose.yml in the root.

## Getting Started

### Prerequisites

- Docker
- Node.js (optional for local dev, not needed for Docker)
- PostgreSQL

### Initial Setup

1. Clone the repository.

```bash
git clone git@github.com:keelworks/KeelCompass.git
```

### Running in Development Environment

In development mode, the app connects to a local PostgreSQL database on your computer. If you are a developer and the backend models have changed, you may need to reset the database to stay in sync (see [`backend/README.md`](backend/README.md) and scroll down to Resetting Database).

1. Open a new terminal and enter the PostgreSQL shell:

```bash
psql -U postgres
```

2. Create a PostgreSQL database for KeelCompass and exit:

```sql
CREATE DATABASE keelworks_keelcompass_db;
\q
```

3. Create a `.env` file in `backend/` using `backend/.env.example`. Set `DATABASE_URL` (or the discrete `DB_*` values) for your local PostgreSQL instance.

4. Create a .env file in frontend/. Copy and paste the contents in .env.example into the newly created .env.

5. On the terminal, navigate to the backend and run the following commands to start the backend server.

```bash
cd KeelCompass/backend
npm install
npm run dev
```

Backend should now be running successfully on one terminal.

6. Open a new terminal and run database migrations.

```bash
cd KeelCompass/backend
npx sequelize-cli db:migrate
```

7. Seed the database from the backend directory.

```bash
cd KeelCompass/backend
npx sequelize-cli db:seed:undo:all
npx sequelize-cli db:seed:all
```

8. Navigate to the frontend and run the following commands to start the frontend server.

```bash
cd KeelCompass/frontend
npm install
npm run dev
```

App should be available on the browser at http://localhost:5173.

9. Alternatively, you can run the app using Docker Compose. Instead of running `npm run dev` for the backend and frontend seperately, navigate to the root directory and run docker-compose.yml.

```bash
cd KeelCompass
docker compose up --build
```

App should be available on the browser at http://localhost:5173.

### Running in Testing Environment

In testing mode, the app uses Dockerized PostgreSQL (defined in `docker-compose.testing.yml`). This setup is fully containerized and does not use your local PostgreSQL server.

1. Create a `.env` file in the project root using `.env.example`. Replace the values with your own PostgreSQL password and database name. These values initialize the PostgreSQL container.

```bash
POSTGRES_PASSWORD=Password1
POSTGRES_DB=keelworks_keelcompass_db
```

2. Create a .env.testing file in backend/. Copy and paste the contents in .env.testing.example into the newly created .env.

3. Create a .env.testing file in frontend/. Copy and paste the contents in .env.testing.example into the newly created .env.

4. On the terminal, navigate to the root directory and run docker-compose.testing.yml. This step will automatically create the database inside the docker container. If one already exists but is out of sync, follow the troubleshooting steps below.

```bash
cd KeelCompass
docker compose -f docker-compose.testing.yml up --build
```

5. Open a new terminal and apply all migrations, if needed.

```bash
docker compose -f docker-compose.testing.yml exec backend npx sequelize-cli db:migrate
```

6. Seed the testing database, if needed.

```bash
docker compose -f docker-compose.testing.yml exec backend npx sequelize-cli db:seed:undo:all
docker compose -f docker-compose.testing.yml exec backend npx sequelize-cli db:seed:all
```

App should be available on the browser at http://localhost:5173.

### Deploying to Render (Free Tier)

This repository now includes a Render Blueprint at `render.yaml` that provisions:

- `keelcompass-api` (Node web service)
- `keelcompass-web` (static frontend)
- `keelcompass-db` (managed PostgreSQL)

1. Push this branch to GitHub.
2. In Render, choose **New +** -> **Blueprint** and connect the repo.
3. Render reads `render.yaml` and creates all three resources.
4. After first deploy, open `keelcompass-web`.

Notes:

- Backend runs migrations on startup with `npm run migrate && npm run start`.
- Frontend uses `VITE_API_URL=https://keelcompass-api.onrender.com/api` by default in `render.yaml`.
- If Render assigns a different backend hostname (for example, service name conflict), update `VITE_API_URL` in the static site environment variables and redeploy.

#### Troubleshooting

- If the database schema inside the docker container is out of sync or you are running into migration errors, stop and remove all containers, networks, and volumes related to this project and start again from step 4.

```bash
docker compose -f docker-compose.testing.yml down --volumes --remove-orphans
```

- To check docker database logs, run the following command.

```bash
docker compose -f docker-compose.testing.yml logs database
```

- To check docker backend logs, run the following command.

```bash
docker compose -f docker-compose.testing.yml logs backend
```
