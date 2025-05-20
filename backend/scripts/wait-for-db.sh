#!/bin/sh

# Fail fast on any command error
set -e

# Host and port for the DB (defaults)
DB_HOST=${DB_HOST:-database}
DB_PORT=${DB_PORT:-3306}

echo "⏳ Waiting for MySQL at $DB_HOST:$DB_PORT..."

# Loop until the DB is available
until nc -z "$DB_HOST" "$DB_PORT"; do
  echo "🚫 Database not ready yet — retrying in 1s..."
  sleep 1
done

echo "✅ MySQL is up — starting backend"
npm run test
