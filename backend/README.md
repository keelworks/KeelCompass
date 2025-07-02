# KeelCompass Backend

## Description

This is the backend of KeelCompass project built with Express.js.

## Updating Database Models

Follow these steps after making changes to any model files.

1. Generate migration file

```bash
npx sequelize-cli migration:generate --name your-change-description
```

2. Edit migration file

3. Run migration

```bash
npx sequelize-cli db:migrate
```

4. Reseed data if needed

```bash
npx sequelize-cli db:seed:undo:all
npx sequelize-cli db:seed:all
```

## Resetting Database

1. Open MySQL shell 

```bash
mysql -u root -p
```

2. Drop and recreate the database

```bash
DROP DATABASE keelworks_keelcompass_db;
CREATE DATABASE keelworks_keelcompass_db;
EXIT;
```

3. Run migrations from the backend directory

```bash
npx sequelize-cli db:migrate
```

4. Seed database from the backend directory

```bash
npx sequelize-cli db:seed:all
```
