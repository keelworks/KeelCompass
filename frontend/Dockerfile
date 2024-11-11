# Dockerfile for development
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Delete node_modules and package-lock.json to prevent issues with dependencies
RUN rm -rf node_modules package-lock.json

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install the latest npm version
RUN npm install -g npm@latest

# Install dependencies while skipping optional dependencies
RUN npm install --no-optional

# Copy the rest of the application code to the container
COPY . .

# Expose the port for the Vite development server
EXPOSE 5173

# Run the Vite development server with hot reloading
CMD ["npm", "run", "dev", "--", "--host"]
