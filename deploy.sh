#!/bin/bash

echo "Pulling Repository..."
git pull
echo "Building containers..."
docker-compose up -d --build
