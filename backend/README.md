# KeelCompass Backend

## Description

This is the backend part of KeelCompass project built with Express.js.

## Project Structure.

```
.
├── /node_modules/          # Installed packages
├── /src/                   # Source files
│   ├── /configs/           # Configuration files (e.g., environment, database, etc.)
│   ├── /controllers/       # Route handlers (controllers for different resources)
│   ├── /models/            # Database models
│   ├── /routes/            # API route definitions
│   ├── /services/          # Business logic and service layer
│   ├── /utils/             # Utility functions (helpers, formatters, etc.)
│   └── app.js              # Express app configuration
├── .gitignore              # Git ignore file
├── package.json            # NPM dependencies and scripts
├── keelworksdata_dump.sql  # MySQL database dump file
└── README.md               # Project documentation

```

## Running the Project

### Run the project locally in the development environment.

**Requirements**

Ensure the following software is installed on your local machine:

- Node.js (Recommended version: 14.x or higher)
- MySQL
- npm

**Install Dependencies**

```bash
npm install
```

**Set Up Environment Variables**

Create a .env file in the project root and copy the example file. Replace the configurations in the example file.

**Initialize the Database**

```bash
mysql -u username -p < ./database/latest_dump_file
```

**Start the Development Server**

```bash
npm run dev
```

The server will start at http://localhost:8080 by default
