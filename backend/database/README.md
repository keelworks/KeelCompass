# Database Scripts

This folder contains SQL scripts for creating and upgrading the database. Please follow the instructions below to set up or upgrade your database correctly.

## Structure

The files in this folder are categorized into two types:

1. **Database Creation Scripts** (`keelcompass_dump_x.x.sql`):

   - E.g. `keelcompass_dump_1.0.sql`
   - These scripts create a fresh database schema for a specific version.
   - If you need to set up a new database, use the latest version.

2. **Upgrade Scripts** (`xxxxxx.sql`):
   - E.g. `add_attachment.sql`
   - These scripts upgrade the database from one version to another.
   - If you are running an older version, apply the upgrade scripts sequentially.

## How to Use

### **1. Setting Up a New Database**

If you need to create a new database from scratch, run the script using MySQL:

```sh
mysql -u username -p < creation_script.sql
```

_Always use the latest version to create the most up-to-date database._

### **2. Upgrading an Existing Database**

If you already have a database and need to upgrade it:

Determine your current database version.

Apply the upgrade scripts sequentially, from your version to the latest.

```sh
mysql -u username -p < upgrade_script.sql
```

_The upgrade scripts should specify the base version they are built upon within the script._
