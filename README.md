# KeelCompass App

## Description

KeelCompass is a Next.js full stack app with a frontend and backend, both containerized using Docker Compose.

## Getting Started

### Prerequisites

- Docker
- Node.js
- npm
- MySQL

## Database Config

1. Create a .env file in the project root and copy the example file. Replace the configurations in the example file.

2. If you need to create a new database from scratch, run the script using MySQL:

```bash
mysql -u username -p < creation_script.sql
```

_Always use the latest version to create the most up-to-date database._

3. Check backend/database/upgrades to see if there are upgrades to be made for the latest version.

    - Determine your current database version.
    - Apply the upgrade scripts sequentially, from your version to the latest.

```sh
mysql -u username -p < upgrade_script.sql
```

_The upgrade scripts should specify the base version they are built upon within the script._

## Docker

To build and activate Docker for the app, run

```bash
docker compose up --build
```
