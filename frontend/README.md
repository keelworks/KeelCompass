Thank you for the clarification! Here's an updated version of the `README.md` that includes Tailwind CSS in the project setup:


# KeelCompass Frontend

This project is a frontend application built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. It leverages modern tools for fast development and optimized production builds. The project comes with **ESLint** configuration for code quality and type safety, ensuring smooth development workflows.

The application runs using a **Vite development server** with hot module replacement (HMR) enabled for a smooth, fast development experience. 

## Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Docker Setup](#docker-setup)
  - [Using the Development Dockerfile](#using-the-development-dockerfile)
  - [Using the Production Dockerfile](#using-the-production-dockerfile)
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

This project includes two Dockerfiles:

- **`Dockerfile`**: Used for creating the production build of the application.
- **`Dockerfile.dev`**: Used for the development build with live reloading and other necessary development tools.

### Using the Development Dockerfile

1. **Build the Docker Image**  
   First, build the Docker image for the development environment by running the following command in your terminal:

   ```bash
   docker build -t keelcompass-frontend-dev . -f Dockerfile.dev
   ```

2. **Run the Docker Container**  
   To start the container in development mode, use the following command:

   ```bash
   docker run -d -p 8080:5173 --name keelcompass-frontend-container keelcompass-frontend-dev
   ```

   - **`-p 8080:5173`**: Maps port `5173` (the Vite dev server port inside the container) to port `8080` on your host machine.
   - **`-d`**: Runs the container in detached mode.
   - **`keelcompass-frontend-dev`**: The name of the image you just built.
   - **`--name keelcompass-frontend-container`**: Assigns a name to the container.

3. **Access the Development Server**  
   Once the container is running, open your browser and navigate to:

   ```
   http://localhost:8080
   ```

   This will display the Vite development server with hot reloading enabled. Any changes made to the source code will automatically update in the browser.

### Using the Production Dockerfile

1. **Build the Production Docker Image**  
   To build the Docker image for production, run the following command:

   ```bash
   docker build -t keelcompass-frontend-prod .
   ```

2. **Run the Production Docker Container**  
   To start the container in production mode, use the following command:

   ```bash
   docker run -d -p 80:80 --name keelcompass-frontend-prod keelcompass-frontend-prod
   ```

   - **`-p 80:80`**: Maps port `80` inside the container to port `80` on your local machine, which is the standard port for web servers.
   - The production environment is optimized for performance and does not include hot reloading.

3. **Access the Production Server**  
   Once the container is running, open your browser and navigate to:

   ```
   http://localhost
   ```

   This will display the production version of the application.

## Running the Application

After building and running the Docker containers, the application can be accessed as follows:

- **Development mode**: Open `http://localhost:8080` in your browser to access the development environment with live reloading.
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


