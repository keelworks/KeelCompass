# Database Scripts

This folder contains files for creating, seeding, and upgrading the KeelCompass database. Please follow the instructions carefully based on your situation.

## Structure

The files in this folder are categorized into three types:

1. **Dump Files** (`dumps/keelcompass_dump_x.x.sql`)
   - E.g. `dumps/keelcompass_dump_3.0.sql`
   - These create a fresh database schema + seed data by running raw SQL.
   - **Old method**: Previously used to sync a brand new database.

2. **Upgrade Files** (`upgrades/xxxxxx.sql`)
   - E.g. `upgrades/add_attachment.sql`
   - These are small incremental SQL scripts to upgrade an existing database.
   - Used when only small changes are made and full reseeding is unnecessary.

3. **Seed Files** (`seed_x.x.js`)
   - E.g. `seed_3.1.js`
   - **New method**: Syncs models and populates the database directly via Node.js and Sequelize.
   - Recommended for easier full resets and syncing after model changes.

## Sync DB using seed file

The new recommended way is to use the Node.js seed script.
This method works both for creating a fresh database and for resyncing after model changes.

1.	Make sure you have created your database manually.

```bash
mysql -u root -p
create database keelworks_keelcompass_db;
exit;
```

2.	Install backend dependencies if you haven’t already.

```bash
cd backend
npm install
```

3.	Sync the database schema by running the backend once.

```bash
npm run dev
```

4.	After syncing, stop the backend server. Then run the latest seed file. If it is seed_3.1.js, command is:

```bash
node backend/database/seed_3.1.js
```

After this, your database will be fully synced with tables and test data.

## Sync DB using dump file

Before the seed file system, the database was managed manually with SQL dump and upgrade files.

There are two cases:
	1.	Creating a brand new database
	2.	Upgrading an existing database

1. Creating a New Database from Scratch

If you are starting fresh, you would import the latest dump file located inside backend/database/dumps/.

Steps:
	•	First, create the database manually.

mysql -u root -p
create database keelworks_keelcompass_db;
exit;
	•	Then import the latest dump file.

mysql -u root -p keelworks_keelcompass_db < backend/database/dumps/keelcompass_dump_3.0.sql

(Replace 3.0 with the latest version.)

⸻

2. Upgrading an Existing Database

If you already have a database and only want to apply updates (such as new fields or tables), you would apply the upgrade scripts manually.

Steps:
	•	Find your current database version.
	•	Apply all upgrade scripts sequentially from your version up to the latest.
	•	Upgrade files are located inside backend/database/upgrades/.

Command example:

mysql -u root -p keelworks_keelcompass_db < backend/database/upgrades/add_notifications.sql

You must be careful to apply them in the correct order.
