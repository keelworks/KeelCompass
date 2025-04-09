# Stage 1: Build the application
FROM node:18-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the application with Vite
RUN npm run build

# Stage 2: Serve the application using a lightweight web server
FROM nginx:alpine

# Copy the built application from the previous stage to the NGINX public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the port the application will run on
EXPOSE 80

# Default command to run NGINX
CMD ["nginx", "-g", "daemon off;"]
