# Deploying to the Linode VM

This deploys the production stack (`docker-compose.prod.yml`) to the Linode
instance at `172.234.233.223`. It serves the app over plain HTTP on port 80
since there's no domain yet — add HTTPS later by pointing a domain at this IP
and putting Certbot in front of the `frontend` Nginx container.

## 1. One-time server setup

SSH in:

```bash
ssh -i ~/.ssh/id_ed25519_keelcompass nahmed@172.234.233.223
```

Install Docker Engine + Compose plugin (Debian/Ubuntu):

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
```

Log out and back in (so the group change takes effect), then confirm:

```bash
docker compose version
```

Open only SSH and HTTP in the host firewall:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw enable
```

If this Linode also has a **Cloud Firewall** attached (via the Linode
dashboard, not the OS), make sure it allows inbound TCP 22 and 80 too — the
dashboard firewall is separate from `ufw` and both must allow the traffic.

## 2. Get the code onto the server

```bash
git clone https://github.com/keelworks/KeelCompass.git
cd KeelCompass
```

(Use this HTTPS URL rather than the `git@github.com:...` SSH form used in the
README, unless you've added a deploy key to this VM.)

## 3. Configure production secrets

```bash
cp .env.production.example .env
```

Edit `.env` and set real values for `MYSQL_ROOT_PASSWORD` and `JWT_SECRET`
(e.g. `openssl rand -base64 32` for each). Leave `MYSQL_DATABASE` as-is or
rename it.

## 4. Build and start the stack

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

This starts three containers: `keelcompass-database` (MySQL, not exposed
publicly), `keelcompass-backend` (Express API, not exposed publicly), and
`keelcompass-frontend` (Nginx serving the built React app on port 80, and
reverse-proxying `/api` and `/static` to the backend).

## 5. Run database migrations (first deploy, and after any schema change)

```bash
docker compose -f docker-compose.prod.yml exec backend npx sequelize-cli db:migrate
```

Seed data if you want it (optional, safe to skip in prod unless you want the
sample data):

```bash
docker compose -f docker-compose.prod.yml exec backend npx sequelize-cli db:seed:all
```

## 6. Verify

Open `http://172.234.233.223` in a browser. You should see the KeelCompass
app, and it should be able to log in / hit the API without CORS issues
(frontend and backend are served same-origin through Nginx).

## Redeploying after code changes

```bash
cd KeelCompass
git pull
docker compose -f docker-compose.prod.yml up -d --build
# only if a new migration was added:
docker compose -f docker-compose.prod.yml exec backend npx sequelize-cli db:migrate
```

## Logs / troubleshooting

```bash
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f frontend
docker compose -f docker-compose.prod.yml logs -f database
```

## Stopping / resetting

```bash
docker compose -f docker-compose.prod.yml down          # stop, keep data
docker compose -f docker-compose.prod.yml down --volumes # stop and wipe the DB
```
