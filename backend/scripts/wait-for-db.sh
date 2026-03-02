#!/bin/bash

# Fail fast on any command error
set -e

# Host and port for the DB (defaults)
DB_HOST=${DB_HOST:-database}
DB_PORT=${DB_PORT:-5432}

echo "⏳ Waiting for PostgreSQL at $DB_HOST:$DB_PORT..."

# Loop until the DB is available
until nc -z "$DB_HOST" "$DB_PORT"; do
  echo "🚫 Database not ready yet — retrying in 1s..."
  sleep 1
done

echo "✅ PostgreSQL is up — starting backend"
npm run test
