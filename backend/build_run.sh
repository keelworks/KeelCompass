#!/bin/bash

IMAGE_NAME="keelcompass"
CONTAINER_NAME="keelcompass-container"

# 1. Build Docker image
echo "Building Docker image..."
docker build --no-cache -t $IMAGE_NAME .

# 2. Stop and remove existing containers
echo "Stopping and removing any existing containers..."
docker stop $CONTAINER_NAME 2>/dev/null
docker rm $CONTAINER_NAME 2>/dev/null

# 3. Run container
echo "Running Docker container..."
docker run -d \
  --name $CONTAINER_NAME \
  -p 3000:8080 \
  --env-file .env \
  $IMAGE_NAME


if [ $? -eq 0 ]; then
  echo "Docker container started successfully."
else
  echo "Failed to start Docker container."
  exit 1
fi