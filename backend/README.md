# KeelCompass Backend
## Desciption
This is the backend part of KeelCompass prject built with Express.js. 

## Project Structure
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
To install dependencies, enter the backend folder and run:
```bash
npm install
```

To start the server, use the following command:

```bash
npm start
```

Alternatively, use nodemon for development, run:
```bash
npm run dev
```
The server will start at http://localhost:3000 by default