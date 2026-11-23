# KeelCompass

KeelWorks' internal forum board: members sign in with their KeelWorks Google
account, post questions, reply in Reddit-style threaded discussions that can
go arbitrarily deep, @mention teammates, like/bookmark/report content, and
get real-time notifications on activity. Roles and post visibility are
derived automatically from each person's Google Workspace name tag (e.g.
`Ahmed (SD |OPT)`), with an admin screen to manage the tag→role mapping and
override individual users by hand.

- **Frontend** — React + TypeScript (Vite), Tailwind CSS, Socket.IO client
- **Backend** — Express + Sequelize (MySQL), Socket.IO, Google ID token auth
- **Infra** — Docker Compose, Nginx, GitHub Actions

## What's new in v2.0

- **Google Workspace SSO** replaces password login - no registration step,
  profile picture and display name come straight from Google.
- **Tag-derived RBAC** - Admin / Manager / Staff / Viewer roles resolved from
  the parenthetical in each person's Google display name, with an
  admin-managed mapping table and per-user manual override.
- **Per-post visibility** - a post can be restricted to specific role tags
  (or left open to "Everyone"); visibility is enforced server-side, not just
  hidden in the UI, and the post's own author can always see it.
- **Reddit-style threaded comments** - replies can nest to any depth, shown
  as a connector-line tree, collapsed behind a single "Show replies" toggle
  per thread, with a scrollable bounded area so one huge thread can't blow
  out the page.
- **Fullscreen post view** - any post can expand from its popup into a full
  `/questions/:id` page (and back), and notification links deep-link
  straight into the exact comment, auto-expanding the thread to reveal it.
  Accepted answers are featured at the top of the thread regardless of how
  deep they actually live.
- **@mention autocomplete** - typing `@` in a comment or post searches
  everyone who's signed into KeelCompass and notifies whoever you pick.
- **Real-time notifications** over Socket.IO, with a content snippet of what
  actually happened (not just "someone commented") and automatic cleanup -
  unliking a post or deleting a comment removes the notification it caused
  instead of leaving it to flood someone's list.
- **Reputation, badges, and a leaderboard** - points for likes and accepted
  answers, a personal stats page, and badges computed from real activity.
  Accepted answers, pinned/solved post badges, soft-delete + admin restore.
  Admin panel adds moderation (reports queue, bulk approve/tag/pin), an
  audit log, and a usage-insights dashboard.
- **Markdown post composer** (alongside the existing rich-text editor), a
  duplicate-question nudge while typing a title, and draft auto-save.
  Feedback form submissions are reviewed from the Admin panel only (no
  email).
- **Dark mode and a mobile-responsive layout** throughout, plus a general
  animation/motion pass (toasts instead of browser alerts, animated modals
  and dropdowns, a tree view for comments, etc).

## What's new in v2.1

- **Comment soft-delete ("tombstones")** - deleting a comment replaces it
  with a "[deleted]" / *Comment deleted* placeholder but leaves its replies
  completely untouched, so the rest of the thread keeps working. Deleting a
  post is unaffected by this - it still takes the whole thread out of view.
- **@mention highlighting** - a recognized "@Full Name" mention is now
  visually highlighted wherever it appears (comments and post descriptions),
  not just inserted as plain text.
- **Floating menus no longer get clipped** - the 3-dot post/comment menu and
  the @mention suggestion dropdown are portaled out past whatever scrollable
  popup they're opened inside, instead of being cut off at its edge.
- **Search now also searches comments**, surfacing the matching reply along
  with a glimpse of the post it belongs to.
- **Notifications**: message text consistently names the post ("X replied to
  your comment on 'Y'"); every notification has its own clear ("×") button
  with a swipe animation, there's a "Clear all", and touch devices can swipe
  a notification left or right to dismiss it. Deleting a post now also
  clears every notification that came from it, not just comment/like ones.
- **Admin panel redesigned** - each section (Role Mappings, Users, Feedback,
  Insights, Reports, Deleted Posts, Audit Log) is now a tile that opens
  fullscreen instead of one long scrolling page. The old Posts bulk-table is
  gone; pinning a post is now a direct action on the post itself (card and
  full view), visible only to admins. Feedback entries open in an animated
  popup with a Read checkbox and a Delete button.
- **Reporting** a post or comment now shows a clear confirmation message
  instead of nothing.
- Role-tag visibility was audited end-to-end and confirmed correct; Category
  selection is now mandatory (like Visibility already was); the redundant
  "Feedback & Suggestions" category was removed; tag text is capitalized
  consistently everywhere, including the Admin tables.

## What's new in v3.0

- **Accordion-style post list** replaces the old popup-card interaction - a
  post shows compact in the feed, expands in place on click (the previously
  open one collapses at the same time), and a fullscreen "expand" option is
  still there. Every post card now has a visible border, with a highlighted
  one for whichever post is currently open.
- **Inline image attachments** - an image attached to a post renders as a
  capped-size thumbnail directly in the post instead of a bare file link.
  Clicking it opens a zoomable/pannable lightbox (pinch-to-zoom and drag-pan
  on touch, scroll-wheel/+-/buttons/click-to-zoom on desktop) against a
  dimmed backdrop, rather than a plain new tab.
- **Attachments moved off base64-in-MySQL onto local disk storage**, served
  through an authenticated endpoint that re-checks the same tag-based
  visibility rule as the post itself - scales far better and keeps the
  database small. A Docker volume keeps uploads across container
  recreation in production. Editing a post's title/description no longer
  silently deletes its attachment unless you explicitly remove it.
- **Richer Markdown rendering** - headings, blockquotes, code blocks, images,
  and tables used to be silently stripped when a Markdown-composed post was
  actually displayed (only the live preview showed them correctly); they now
  render everywhere, and code blocks get real syntax highlighting.
- **@mention chips highlight immediately when picked** from the autocomplete
  dropdown (as `@Full Name (Role Tag)`, with a shadowed pill), instead of
  only after the comment/post is actually submitted.
- **Mute a thread** - from a post's menu, stop getting notified about a
  specific thread's activity (new comments, likes, mentions, bookmarks)
  without affecting anyone else or the thread itself.
- **"View all notifications"** opens your full notification history
  fullscreen in place of the post feed, instead of just the capped preview
  in the dropdown.
- **Edit history** - an edited post or comment shows an "(edited)" marker
  that opens every prior saved version, with its own timestamp.
- **Admin: bulk actions** - multi-select to dismiss several reports or
  restore several deleted posts at once, instead of one at a time. Insights
  also now lists actual stale/unanswered posts (3+ days, no replies), not
  just a bare count.
- **Search** now ranks results by actual text relevance (MySQL full-text
  search) instead of only ever sorting by recency, and no longer leaks
  soft-deleted comments into results.
- **Skeleton loading states** for the post feed, notifications, leaderboard,
  stats, and edit history, instead of plain "Loading..." text.
- **Accessibility pass** - every modal/dialog (confirmations, feedback, edit
  history, the image lightbox) now traps Tab focus inside itself, closes on
  Escape, restores focus to whatever opened it, and carries proper dialog
  ARIA roles.
- **Automated tests + CI** - Jest/Supertest (backend) and Vitest/React
  Testing Library (frontend) unit and integration tests now run in GitHub
  Actions on every push/PR, and a production deploy no longer happens
  unless lint, typecheck, and the test suite all pass first.
- Carried over from the in-progress work at the end of v2.1: comments can
  now be replied to by their own author (starting a reply chain no longer
  required someone else's comment first), Reply/Show-replies are visually
  distinct (bold green/blue), accepting an answer is a 3-dot menu action
  restricted to the post's author (shown as a read-only badge once
  accepted), the Unanswered tab was removed (a post can be purely
  informational), and Visibility is optional when asking a question.

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
  .github/workflows/deploy.yml    # CI (lint/typecheck/test) + auto-deploy on `main`
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
| `backend/` | `npm run test:unit` | Run the Jest/Supertest test suite |
| `frontend/` | `npm run dev` | Start the Vite dev server |
| `frontend/` | `npm run build` | Type-check and build for production |
| `frontend/` | `npm run preview` | Preview a production build locally |
| `frontend/` | `npm run lint` | Run ESLint |
| `frontend/` | `npm run test:unit` | Run the Vitest/React Testing Library suite |

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

# Google Sign-In - create a Client ID in Google Cloud Console for the
# KeelWorks Workspace (no client secret needed, this is ID-token-only)
GOOGLE_CLIENT_ID=
ALLOWED_SIGNUP_DOMAIN=keelworks.org

# first sign-in with this email is auto-granted the admin role, so there's
# always at least one admin able to manage role-tag mappings
BOOTSTRAP_ADMIN_EMAIL=

# where question/comment attachments are stored on disk - a relative path is
# fine for a plain VM, Docker uses an absolute path backed by a named volume
UPLOAD_DIR=./uploads
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

**Auth** — Google Workspace SSO (ID token, no password), JWT session after
first sign-in. Roles (`admin`/`manager`/`staff`/`viewer`) are derived from
the role tag embedded in each person's Google display name and re-synced on
every login; an admin can override a person's tag directly.

**Questions** — rich-text or Markdown composer (headings, lists, blockquotes,
code blocks with syntax highlighting, images, tables all render correctly),
optional file attachment (shown inline for images, with a zoomable lightbox),
mandatory category and optional visibility-tag selection (pick specific
groups or "Everyone"), duplicate-question nudge while typing a title, draft
auto-saved locally. Browse by Most Recent or Popular (both pinned-first);
search by keyword across both posts and comments, ranked by actual text
relevance, with category/tag/date/status filters. Admins can pin/unpin any
post directly, from either the card or the full view. The feed itself is an
accordion - clicking a post expands it in place (collapsing whichever was
open), rather than a popup. An edited post shows its prior versions via an
"(edited)" link, and anyone can mute a specific thread's notifications
without affecting the thread for anyone else.

**Comments** — Reddit-style threaded replies with no depth limit (including
replying to your own comment), shown as a smooth curved connector tree in a
single consistent card style at every depth, collapsed behind a single
expand toggle per thread (Reply in bold green, Show/Hide replies in bold
blue). @mention autocomplete searches everyone who's signed in, shows the
matched person's role tag in the dropdown, highlights the picked mention as
a chip immediately (not just after posting), and notifies whoever's picked.
The question's author can mark any comment, at any depth, as the accepted
answer via the comment's menu - it's featured at the top of the thread and
the answerer gets +5 reputation. Deleting a comment replaces it with a
"[deleted]" tombstone rather than removing it, so replies underneath it keep
working. An edited comment shows its prior versions the same way posts do.

**Post views** — a quick popup from any list, or an "expand" button into a
fullscreen `/questions/:id` page; notification links land on the exact
comment via the same route.

**Engagement** — like or report questions/comments (reporting shows a
confirmation message), bookmark ("Interest") questions to revisit later
(bookmarking also follows the question for new comments). Reputation
points, badges, and a leaderboard; a personal stats page.

**Moderation & Admin** — a tile per section (Role Mappings, Users, Feedback,
Insights, Reports, Deleted Posts, Audit Log) that opens fullscreen: role-tag
mapping management, per-user manual role/tag override, grant/revoke admin, a
reports queue (multi-select to dismiss several at once), soft-deleted posts
with restore (also multi-select), an audit log of admin actions, and a usage
insights dashboard (volume, response times, top categories/tags, and an
actual list of stale/unanswered posts, not just a count). Feedback entries
open in a popup with a Read checkbox and a Delete button.

**Notifications** — real-time over Socket.IO, with a content snippet of
what actually happened and the post it's about. Each one has its own clear
button (swipe-right animation; touch devices can swipe either direction),
plus a "Clear all" and a "View all notifications" link that opens your full
history fullscreen. Undoing the action that caused a notification (unliking,
deleting a comment, deleting a post) removes the notification too, instead
of leaving stale entries. Muting a thread stops its notifications for just
you, without touching the thread itself or anyone else.

**Feedback** — an in-app feedback form; submissions are reviewed from the
Admin panel (not emailed anywhere).

**Resource pages** — static career/education articles served directly by
the backend at `/static/career` and `/static/education`.

---

## API Overview

All endpoints are mounted under `/api`. A Socket.IO server also runs on the
same HTTP server at path `/api/socket.io` for real-time notifications.

| Resource | Method | Endpoint | Access | Purpose |
|---|---|---|---|---|
| Auth | `POST` | `/auth/google` | Public | Sign in with a Google ID token |
| Categories | `GET` | `/categories` | Public | List categories |
| Search | `POST` | `/search` | Auth | Search questions and comments (keyword, category/tag/date/status filters) |
| Questions | `GET` | `/questions` | Auth | List recent questions (pinned-first) |
| Questions | `GET` | `/questions/popular` | Auth | List popular questions (pinned-first) |
| Questions | `GET` | `/questions/similar` | Auth | Duplicate-question nudge by title |
| Questions | `GET` | `/questions/tags` | Auth | List known visibility tags |
| Questions | `GET` | `/questions/:id` | Auth | Get a question + its comment tree |
| Questions | `POST` | `/questions` | Auth | Create a question (rate-limited) |
| Questions | `PUT` | `/questions/:id` | Auth | Update a question |
| Questions | `PATCH` | `/questions/:id/accept-answer` | Auth | Mark/unmark a comment as the accepted answer |
| Questions | `POST`/`DELETE` | `/questions/:id/mute` | Auth | Mute/unmute a thread's notifications for yourself |
| Questions | `GET` | `/questions/:id/history` | Auth | Prior saved versions of a post's title/description |
| Questions | `DELETE` | `/questions/:id` | Auth | Soft-delete a question |
| Question actions | `POST`/`DELETE` | `/question-actions/action` | Auth | Like/report a question |
| Comments | `POST` | `/comments` | Auth | Create a comment/reply (rate-limited, supports `mentionedUserIds`) |
| Comments | `PUT` | `/comments/:id` | Auth | Update a comment |
| Comments | `GET` | `/comments/:id/history` | Auth | Prior saved versions of a comment's content |
| Comments | `DELETE` | `/comments/:id` | Auth | Soft-delete a comment (replaces it with a "[deleted]" tombstone; replies are untouched) |
| Comment actions | `POST`/`DELETE` | `/comment-actions/action` | Auth | Like/report a comment |
| Attachments | `GET` | `/attachments/:id/file` | Auth | Stream an attachment's bytes (re-checks the owning post's visibility) |
| Interests | `GET`/`POST`/`DELETE` | `/interests` | Auth | List/add/remove a bookmark ("follow") |
| Notifications | `GET` | `/notifications` | Auth | List your notifications |
| Notifications | `POST` | `/notifications/announcement` | Auth | Broadcast to all users |
| Notifications | `PATCH` | `/notifications/:id/mark-read` | Auth | Mark a notification read |
| Notifications | `DELETE` | `/notifications/:id` | Auth | Clear a single notification |
| Notifications | `DELETE` | `/notifications` | Auth | Clear all of your notifications |
| Users | `GET` | `/users/me` | Auth | Get your own profile (includes resolved roles) |
| Users | `PATCH` | `/users/me` | Auth | Complete profile setup (username) |
| Users | `GET` | `/users/me/stats` | Auth | Your reputation, activity counts, badges |
| Users | `GET` | `/users/leaderboard` | Auth | Top contributors by reputation |
| Users | `GET` | `/users/search?q=` | Auth | @mention autocomplete directory search |
| Users | `GET` | `/users/:userId` | Auth | Get another user's profile |
| Feedback | `POST` | `/feedback` | Auth | Submit feedback (reviewed in Admin) |
| Admin | `GET`/`POST`/`DELETE` | `/admin/role-mappings` | Admin | Manage tag→role mappings |
| Admin | `GET` | `/admin/users` | Admin | List users with resolved roles/tags |
| Admin | `POST`/`DELETE` | `/admin/users/:id/admin` | Admin | Grant/revoke admin |
| Admin | `PATCH` | `/admin/users/:id/tag` | Admin | Override a user's role tag |
| Admin | `GET` | `/admin/feedback` | Admin | List feedback submissions |
| Admin | `PATCH` | `/admin/feedback/:id/read` | Admin | Mark feedback read/unread |
| Admin | `DELETE` | `/admin/feedback/:id` | Admin | Delete a feedback submission |
| Admin | `GET` | `/admin/audit-log` | Admin | Recent admin actions |
| Admin | `GET`/`PATCH` | `/admin/questions*` | Admin | List posts, pin/unpin, bulk-approve/bulk-tag |
| Admin | `GET`/`POST` | `/admin/questions/deleted`, `/admin/questions/:id/restore` | Admin | Soft-deleted posts + restore |
| Admin | `GET`/`DELETE` | `/admin/reports` | Admin | Reports queue + dismiss |
| Admin | `GET` | `/admin/insights` | Admin | Usage insights dashboard data |

---

## Deployment

Production runs as three Docker containers behind Nginx:

- **`database`** — MySQL 8, persisted in a Docker volume, not exposed outside the container network
- **`backend`** — the Express API, not exposed outside the container network
- **`frontend`** — Nginx serving the built React app and reverse-proxying `/api` and `/static` to the backend

Pushing to `main` runs lint, typecheck, and the test suite for both
`backend/` and `frontend/` first; only if all of that passes does
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) SSH into the
server and re-run `docker compose -f docker-compose.prod.yml up -d --build`,
then apply any new database migrations. The same checks run on pull
requests against `main` too, without deploying.

Full server setup, the exact Nginx configuration in use, and manual deploy
steps are in [DEPLOY.md](DEPLOY.md).

---

## Known Limitations

- No custom domain or HTTPS yet.
- Database seeding is manual/one-time — it's not run automatically on deploy since re-running it isn't idempotent.
- Test coverage is deliberately modest so far - unit tests for the pure
  logic (role-tag parsing, text helpers, mention highlighting) plus a
  handful of auth-gating/validation integration tests and component tests,
  not an exhaustive end-to-end suite. It's enough to gate deploys on
  something real, not a guarantee every feature is covered.
- @mention autocomplete searches KeelCompass's own user table (everyone who
  has signed in at least once), not the live Google Workspace directory -
  someone who has never logged in won't show up until they do. A true
  Workspace-directory lookup would need a Google Admin service account with
  domain-wide delegation, which is a separate, admin-console-level setup.
- @mention and the duplicate-question nudge are wired into comments/replies
  and the Markdown post composer; the rich-text (non-Markdown) post composer
  doesn't support @mention yet.
- @mention *highlighting* in rendered text is a "looks like `@Full Name`"
  pattern match, not a lookup against real users - it's cosmetic only. The
  actual notification is driven separately by the real selection made in the
  autocomplete, so highlighting and notifying can't get out of sync with
  each other even though the highlight itself doesn't verify the name.