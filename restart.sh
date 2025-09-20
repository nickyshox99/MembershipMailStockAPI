#!/bin/bash

# Restart Docker Services
# Usage: ./restart.sh

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔄 Restarting Docker Services...${NC}"

# Stop services
echo "🛑 Stopping services..."
docker-compose down

# Wait a moment
sleep 2

# Start services
echo "🚀 Starting services..."
docker-compose up -d

echo -e "${GREEN}✅ All services restarted successfully!${NC}"
echo ""
echo "🌐 Services available at:"
echo "   • API: http://localhost:10600"
echo "   • phpMyAdmin: http://localhost:8080"
echo "   • MySQL: localhost:3306"
