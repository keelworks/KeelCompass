# KeelCompass Frontend

This project is a frontend application built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. It leverages modern tools for fast development and optimized production builds. The project comes with **ESLint** configuration for code quality and type safety, ensuring smooth development workflows.

The application runs using a **Vite development server** with hot module replacement (HMR) enabled for a smooth, fast development experience.

## Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Docker Setup](#docker-setup)
  - [Development Setup](#development-setup)
  - [Production Setup](#production-setup)
- [Running the Application](#running-the-application)
- [ESLint Setup](#eslint-setup)
- [Tailwind CSS Setup](#tailwind-css-setup)
- [Project Structure](#project-structure)
- [License](#license)

## Getting Started

Follow the steps below to get the development environment running locally using Docker.

### Prerequisites

- **Docker**: Ensure that Docker is installed on your machine. You can download it from [Docker's official website](https://www.docker.com/get-started).
- **Node.js**: The project uses Node.js version 18, as specified in the Dockerfile.

## Docker Setup

This project includes two Docker Compose files for running the application in different environments:

- **`docker-compose.yml`**: Used for setting up the development environment.
- **`docker-compose.prod.yml`**: Used for setting up the production environment.

### Development Setup

1. **Build and Run the Docker Containers for Development**  
   To start the application in **development mode**, use the following command:

   ```bash
   docker-compose up --build
   ```

   This will build and start the Docker container using `Dockerfile.dev` for the development environment, exposing the Vite development server on port `5173`. It will also set up live reloading for a smooth development experience.

2. **Access the Development Server**  
   Once the containers are up and running, open your browser and navigate to:

   ```
   http://localhost:5173
   ```

   This will display the Vite development server with hot reloading enabled. Any changes made to the source code will automatically update in the browser.

### Production Setup

1. **Build and Run the Docker Containers for Production**  
   To start the application in **production mode**, use the following command:

   ```bash
   docker-compose -f docker-compose.prod.yml up --build
   ```

   This will build and start the Docker container using `Dockerfile` for the production environment, optimizing the application for performance and serving it on port `80`.

2. **Access the Production Server**  
   Once the containers are up and running, open your browser and navigate to:

   ```
   http://localhost
   ```

   This will display the production version of the application.

## Running the Application

After building and running the Docker containers, the application can be accessed as follows:

- **Development mode**: Open `http://localhost:5173` in your browser to access the development environment with live reloading.
- **Production mode**: Open `http://localhost` in your browser to access the optimized production environment.

## ESLint Setup

To ensure code quality and consistency, the project uses **ESLint** with TypeScript support. We recommend enabling type-aware linting rules by configuring your ESLint setup.

1. **Updating the ESLint Configuration**  
   Configure the top-level `parserOptions` property to enable type checking:

   ```js
   export default tseslint.config({
     languageOptions: {
       // other options...
       parserOptions: {
         project: ['./tsconfig.node.json', './tsconfig.app.json'],
         tsconfigRootDir: import.meta.dirname,
       },
     },
   })
   ```

2. **Replace ESLint Config**  
   Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`. Optionally, add `...tseslint.configs.stylisticTypeChecked`.

3. **Install and Configure React ESLint Plugin**  
   Install the [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update your configuration:

   ```js
   // eslint.config.js
   import react from 'eslint-plugin-react'

   export default tseslint.config({
     // Set the react version
     settings: { react: { version: '18.3' } },
     plugins: {
       // Add the react plugin
       react,
     },
     rules: {
       // other rules...
       // Enable its recommended rules
       ...react.configs.recommended.rules,
       ...react.configs['jsx-runtime'].rules,
     },
   })
   ```

## Tailwind CSS Setup

This project uses **Tailwind CSS** for utility-first CSS styling. To ensure it works properly in development and production builds:

1. **Tailwind Installation**  
   Tailwind is already installed and configured with PostCSS in the project. If you're setting it up for the first time, follow these steps:

   - Install the necessary dependencies:

     ```bash
     npm install -D tailwindcss postcss autoprefixer
     npx tailwindcss init
     ```

   - In your `tailwind.config.js` file, configure the content paths:

     ```js
     /** @type {import('tailwindcss').Config} */
     module.exports = {
       content: [
         "./index.html",
         "./src/**/*.{js,ts,jsx,tsx}",
       ],
       theme: {
         extend: {},
       },
       plugins: [],
     }
     ```

   - In your `src/index.css` (or wherever you include global styles), add the following:

     ```css
     @tailwind base;
     @tailwind components;
     @tailwind utilities;
     ```

2. **Vite Integration**  
   The `vite.config.ts` is preconfigured to work with Tailwind. Make sure your Vite project includes PostCSS support for it to work properly.

## Project Structure

- `docker-compose.yml`: The Docker Compose configuration for building and running the development environment.
- `docker-compose.prod.yml`: The Docker Compose configuration for building and running the production environment.
- `Dockerfile`: The Dockerfile for building the production environment.
- `Dockerfile.dev`: The Dockerfile for building the development environment with Vite and live reloading.
- `tailwind.config.js`: Tailwind CSS configuration file.
- `postcss.config.js`: PostCSS configuration for Tailwind.
- `package.json`: Contains the project's dependencies and scripts.
- `src/`: This is where the source code for the frontend lives.
- `public/`: Static assets like images and fonts.
- `node_modules/`: Dependencies installed by `npm install`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.