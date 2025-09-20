#!/bin/bash

# Start Docker Services
# Usage: ./start.sh

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🚀 Starting Docker Services...${NC}"

# Check if containers are already running
if docker ps --format "table {{.Names}}" | grep -q "membership_mysql"; then
    echo -e "${YELLOW}⚠️  Services are already running!${NC}"
    echo "Run './stop.sh' to stop them first, or './restart.sh' to restart"
    exit 1
fi

# Start MySQL and phpMyAdmin
echo "🐬 Starting MySQL and phpMyAdmin..."
docker-compose up -d mysql phpmyadmin

# Wait for MySQL
echo "⏳ Waiting for MySQL to be ready..."
sleep 15

# Start API
echo "🔌 Starting API service..."
docker-compose up -d api

echo -e "${GREEN}✅ All services started successfully!${NC}"
echo ""
echo "🌐 Services available at:"
echo "   • API: http://localhost:10600"
echo "   • phpMyAdmin: http://localhost:8080"
echo "   • MySQL: localhost:3306"
echo ""
echo "📊 Run './status.sh' to check service status"
echo "📋 Run './logs.sh' to view service logs"
