# KeelCompass  Frontend

This project is a frontend application built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. It leverages modern tools for fast development and optimized production builds. The project comes with **ESLint** configuration for code quality and type safety, ensuring smooth development workflows.

The application runs using a **Vite development server** with hot module replacement (HMR) enabled for a smooth, fast development experience.

## Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Running the Application](#running-the-application)
- [ESLint Setup](#eslint-setup)
- [Tailwind CSS Setup](#tailwind-css-setup)
- [Project Structure](#project-structure)
- [License](#license)

## Running the Project

### Run the project locally in the development environment.

**Requirements**

Ensure the following software is installed on your local machine:

- Node.js (Recommended version: 14.x or higher)
- PostgreSQL (for backend API when running full stack locally)
- npm

**Install Dependencies**

```bash
npm install
```

**Start the Development Server**

```bash
npm run dev
```

The server will start at http://localhost:5173 by default.

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

- `Dockerfile`: The Dockerfile for building the development environment.
- `tailwind.config.js`: Tailwind CSS configuration file.
- `postcss.config.js`: PostCSS configuration for Tailwind.
- `package.json`: Contains the project's dependencies and scripts.
- `src/`: This is where the source code for the frontend lives.
- `public/`: Static assets like images and fonts.
- `node_modules/`: Dependencies installed by `npm install`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
