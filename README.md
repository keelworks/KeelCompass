# KeelCompass

A community Q&A platform for career development, job searching, and
education. Members post questions, reply in threaded discussions, like or
report content, bookmark questions they care about, and get notified on
activity. A `facilitator` role reviews and approves/rejects submitted
questions; everyone else is a `volunteer`.

- **Frontend** — React + TypeScript (Vite)
- **Backend** — Express + Sequelize (MySQL)
- **Infra** — Docker Compose, Nginx, GitHub Actions

---

## Public Deployment

| Component | Hosting | URL |
|---|---|---|
| Web app (frontend + API, same origin) | Docker Compose on a Linode VM | `http://172.234.233.223` |

There's no custom domain yet, so the app is served over plain HTTP on the
bare IP. Pushes to `main` auto-deploy — see [Deployment](#deployment) below.

---

## Fastest Local Setup

1. **Clone and start MySQL locally** (Docker Compose still relies on a MySQL
   server on your host machine — see [Environment Variables](#environment-variables)):
   ```bash
   git clone https://github.com/keelworks/KeelCompass.git
   cd KeelCompass
   mysql -u root -p
   ```
   ```sql
   CREATE DATABASE keelworks_keelcompass_db;
   EXIT;
   ```

2. **Set up env files**:
   ```bash
   cp backend/.env.example backend/.env      # fill in your DB credentials
   cp frontend/.env.example frontend/.env
   ```

3. **Migrate and seed the database**:
   ```bash
   cd backend && npm install
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   cd ..
   ```

4. **Run it**:
   ```bash
   docker compose up --build
   ```
   Or without Docker: `npm run dev` in `backend/` and, in a separate
   terminal, `npm run dev` in `frontend/` (after `npm install` in each).

App: `http://localhost:5173` · API: `http://localhost:8080`

### Fully isolated testing stack

`docker-compose.testing.yml` runs its own containerized MySQL instead of your
local one — useful for a clean-slate test run that won't touch your dev data:

```bash
cp .env.example .env   # sets MYSQL_PASSWORD / MYSQL_DATABASE for the test DB container
cp backend/.env.testing.example backend/.env.testing
cp frontend/.env.testing.example frontend/.env.testing
docker compose -f docker-compose.testing.yml up --build
```

Then, in another terminal:
```bash
docker compose -f docker-compose.testing.yml exec backend npx sequelize-cli db:migrate
docker compose -f docker-compose.testing.yml exec backend npx sequelize-cli db:seed:all
```

If the schema gets out of sync, reset it with
`docker compose -f docker-compose.testing.yml down --volumes --remove-orphans`
and repeat from the `up --build` step.

---

## Project Structure

```text
KeelCompass/
  backend/
    server.js                 # Entry point
    src/
      app.js                  # Express app, middleware, error handlers
      routes/                 # One router per resource, mounted under /api/*
      controllers/             # Thin request handlers
      services/                # Business logic
      models/                  # Sequelize models
      middlewares/              # isUser / isFacilitator guards
      configs/dbConfig.js
      utils/logger.js
    migrations/                # Sequelize migrations (schema history)
    seeders/                    # Sample data
    Dockerfile                  # Dev image
    Dockerfile.prod              # Production image

  frontend/
    src/
      main.tsx / App.tsx        # Entry point and routes
      pages/                     # Auth, Dashboard, QnA, ...
      features/                  # Feature-scoped components (dashboard, qna)
      components/                # Shared/reusable components
      utils/                     # API client, formatting helpers, types
    Dockerfile                   # Dev image
    Dockerfile.prod                # Production image
    nginx.conf                     # Used by the production image

  docker-compose.yml              # Local development stack
  docker-compose.testing.yml      # Isolated testing stack (incl. MySQL container)
  docker-compose.prod.yml         # Production stack
  DEPLOY.md                       # Full production deployment runbook
  .github/workflows/deploy.yml    # CI/CD: auto-deploys `main`
```

Deeper technical docs: [ARCHITECTURE.md](ARCHITECTURE.md) (request flow, DB
schema, auth design), [backend/README.md](backend/README.md),
[frontend/README.md](frontend/README.md).

---

## Available Commands

| Where | Command | Purpose |
|---|---|---|
| `backend/` | `npm run dev` | Start the API locally with hot reload (nodemon) |
| `backend/` | `npm start` | Start the API in production mode |
| `backend/` | `npx sequelize-cli db:migrate` | Apply database migrations |
| `backend/` | `npx sequelize-cli db:seed:all` | Seed sample data |
| `frontend/` | `npm run dev` | Start the Vite dev server |
| `frontend/` | `npm run build` | Type-check and build for production |
| `frontend/` | `npm run preview` | Preview a production build locally |
| `frontend/` | `npm run lint` | Run ESLint |

---

## Environment Variables

**`backend/.env`**
```env
PORT=8080
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_DATABASE=keelworks_keelcompass_db
DB_DIALECT=mysql
LOG_PATH=logs/app.log
JWT_SECRET=replace_with_a_long_random_secret
```

**`frontend/.env`**
```env
VITE_API_URL=http://localhost:8080/api
```

**Production** (`docker-compose.prod.yml`, set via a root `.env` — see
[DEPLOY.md](DEPLOY.md)):
```env
MYSQL_ROOT_PASSWORD=replace_with_a_long_random_secret
MYSQL_DATABASE=keelworks_keelcompass_db
JWT_SECRET=replace_with_a_long_random_secret
```

---

## Core Features

**Auth** — register/login, JWT-based sessions.

**Questions** — post a question with an optional file attachment, browse
by Most Recent or Popular, search by keyword, filter by category (Career
Development, Job Search, Education, Keelworks), edit/delete your own.

**Comments** — threaded (nested) replies on questions, with optional
attachments.

**Engagement** — like or report questions/comments, bookmark ("Interest")
questions to revisit later.

**Moderation** — facilitators see pending questions and approve or reject
them.

**Notifications** — in-app notifications for activity on your content, plus
admin-style announcements broadcast to all users.

**Resource pages** — static career/education articles served directly by
the backend at `/static/career` and `/static/education`.

---

## API Overview

All endpoints are mounted under `/api`.

| Resource | Method | Endpoint | Access | Purpose |
|---|---|---|---|---|
| Auth | `POST` | `/auth/register` | Public | Create an account |
| Auth | `POST` | `/auth/login` | Public | Log in |
| Categories | `GET` | `/categories` | Public | List categories |
| Search | `POST` | `/search` | Auth | Search questions by keyword |
| Questions | `GET` | `/questions` | Auth | List recent questions |
| Questions | `GET` | `/questions/popular` | Auth | List popular questions |
| Questions | `GET` | `/questions/pending` | Facilitator | List questions awaiting review |
| Questions | `GET` | `/questions/:id` | Auth | Get a question |
| Questions | `POST` | `/questions` | Auth | Create a question |
| Questions | `PUT` | `/questions/:id` | Auth | Update a question |
| Questions | `PATCH` | `/questions/:id/status` | Facilitator | Approve/reject a question |
| Questions | `DELETE` | `/questions/:id` | Auth | Delete a question |
| Question actions | `POST`/`DELETE` | `/question-actions/action` | Auth | Like/report a question |
| Comments | `POST` | `/comments` | Auth | Create a comment/reply |
| Comments | `PUT` | `/comments/:id` | Auth | Update a comment |
| Comments | `DELETE` | `/comments/:id` | Auth | Delete a comment |
| Comment actions | `POST`/`DELETE` | `/comment-actions/action` | Auth | Like/report a comment |
| Interests | `GET` | `/interests` | Auth | List your bookmarked questions |
| Interests | `POST` | `/interests` | Auth | Bookmark a question |
| Interests | `DELETE` | `/interests/:id` | Auth | Remove a bookmark |
| Notifications | `GET` | `/notifications` | Auth | List your notifications |
| Notifications | `POST` | `/notifications/announcement` | Auth | Broadcast to all users |
| Notifications | `PATCH` | `/notifications/:id/mark-read` | Auth | Mark a notification read |
| Users | `GET` | `/users/me` | Auth | Get your own profile |
| Users | `GET` | `/users/:userId` | Auth | Get another user's profile |

---

## Deployment

Production runs as three Docker containers behind Nginx:

- **`database`** — MySQL 8, persisted in a Docker volume, not exposed outside the container network
- **`backend`** — the Express API, not exposed outside the container network
- **`frontend`** — Nginx serving the built React app and reverse-proxying `/api` and `/static` to the backend

Pushing to `main` auto-deploys via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):
a GitHub Actions runner SSHes into the server and re-runs
`docker compose -f docker-compose.prod.yml up -d --build`, then applies any
new database migrations.

Full server setup, the exact Nginx configuration in use, and manual deploy
steps are in [DEPLOY.md](DEPLOY.md).

---

## Known Limitations

- No custom domain or HTTPS yet.
- Database seeding is manual/one-time — it's not run automatically on deploy since re-running it isn't idempotent.
- No automated test suite yet.