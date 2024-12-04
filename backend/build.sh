#!/bin/bash

IMAGE_NAME="keelcompass"
CONTAINER_NAME="keelcompass-container"

# 1. Build Docker image
echo "Building Docker image..."
docker build --no-cache -t $IMAGE_NAME .