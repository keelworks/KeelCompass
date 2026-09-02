# Deployment

KeelCompass runs in production on a Linode VM (`172.234.233.223`) as three
Docker containers (`database`, `backend`, `frontend`), defined in
[`docker-compose.prod.yml`](docker-compose.prod.yml). There's no domain yet,
so the app is served over plain HTTP on the bare IP.

## How production traffic actually flows

This VM is shared with an unrelated project, and already had a system-level
Nginx installed and bound to port 80 before KeelCompass was containerized. To
avoid touching anything outside this app's scope, our stack does **not**
publish port 80 directly:

```
Internet → host Nginx (port 80, /etc/nginx/sites-available/keelcompass)
         → our "frontend" container, published only on 127.0.0.1:3002
              → serves the built React app
              → proxies /api and /static to the "backend" container (internal Docker network only)
                   → MySQL ("database" container, internal Docker network only)
```

The `database` and `backend` containers publish no host ports at all — they're
only reachable from other containers on the compose network. Only the host
Nginx (port 80) and SSH (port 22) are open to the internet.

If this app ever moves to its own dedicated VM, `docker-compose.prod.yml`'s
`frontend` service could instead publish `"80:80"` directly and the host Nginx
step below could be skipped entirely.

## Continuous deployment

Every push to `main` automatically deploys via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): a GitHub
Actions runner SSHes into the VM (using the `PROD_HOST`, `PROD_USER`, and
`PROD_SSH_KEY` repository secrets) and runs:

```bash
cd ~/KeelCompass
git fetch origin main
git checkout main
git reset --hard origin/main
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml exec -T backend npx sequelize-cli db:migrate
```

Migrations are safe to run on every deploy (`sequelize-cli` skips ones already
applied). Seeding is **not** run automatically — it's not idempotent, so
re-running it would duplicate sample data.

Watch a deploy under the repo's **Actions** tab on GitHub. If the workflow
fails, the error output there will show which step broke.

## Manual deploy (fallback / troubleshooting)

If you need to deploy without waiting on CI, SSH into the VM and run the same
commands the workflow runs:

```bash
ssh <user>@172.234.233.223
cd ~/KeelCompass
git checkout main && git pull
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml exec backend npx sequelize-cli db:migrate
```

`nahmed` has passwordless Docker access (member of the `docker` group), so
none of this needs `sudo`.

## One-time server setup

These steps only need to be redone if the app moves to a new box, or a new
deploy user/key is needed.

1. **Install Docker**:
   ```bash
   curl -fsSL https://get.docker.com | sudo sh
   sudo usermod -aG docker <user>
   ```
   Log out and back in for the group change to apply, then confirm `docker ps`
   works without `sudo`.

2. **Firewall**: only SSH and HTTP need to be open.
   ```bash
   sudo ufw allow OpenSSH
   sudo ufw allow 80/tcp
   sudo ufw enable
   ```
   If the VM also has a Linode Cloud Firewall attached (separate from `ufw`),
   it needs matching rules for inbound TCP 22 and 80.

3. **Secrets**: copy `.env.production.example` to `.env` in the repo root on
   the server and fill in real values:
   ```bash
   cp .env.production.example .env
   openssl rand -base64 32   # use for MYSQL_ROOT_PASSWORD
   openssl rand -base64 32   # use for JWT_SECRET
   ```

4. **Host Nginx**, pointed at the frontend container's published port:
   ```bash
   sudo tee /etc/nginx/sites-available/keelcompass > /dev/null <<'EOF'
   server {
       listen 80;
       server_name 172.234.233.223;

       location / {
           proxy_pass http://127.0.0.1:3002;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   EOF
   sudo ln -sf /etc/nginx/sites-available/keelcompass /etc/nginx/sites-enabled/keelcompass
   sudo nginx -t && sudo systemctl reload nginx
   ```

5. **First deploy** (build the stack and set up the database):
   ```bash
   git clone https://github.com/keelworks/KeelCompass.git
   cd KeelCompass
   docker compose -f docker-compose.prod.yml up -d --build
   docker compose -f docker-compose.prod.yml exec backend npx sequelize-cli db:migrate
   docker compose -f docker-compose.prod.yml exec backend npx sequelize-cli db:seed:all   # optional, sample data
   ```

6. **CI/CD deploy key** (lets GitHub Actions redeploy automatically):
   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/keelcompass_deploy -N "" -C "github-actions-deploy"
   cat ~/.ssh/keelcompass_deploy.pub >> ~/.ssh/authorized_keys
   cat ~/.ssh/keelcompass_deploy   # copy this into the PROD_SSH_KEY GitHub secret
   ```
   Then, in the repo's GitHub Settings → Secrets and variables → Actions, add
   `PROD_SSH_KEY` (the private key above), `PROD_HOST`, and `PROD_USER`.

## Logs / troubleshooting

```bash
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f frontend
docker compose -f docker-compose.prod.yml logs -f database
docker compose -f docker-compose.prod.yml ps
```

## Stopping / resetting

```bash
docker compose -f docker-compose.prod.yml down           # stop, keep data
docker compose -f docker-compose.prod.yml down --volumes  # stop and wipe the database
```