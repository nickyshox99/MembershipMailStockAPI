#!/bin/bash

# Show Docker Services Status
# Usage: ./status.sh

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}📊 Docker Services Status${NC}"
echo "================================"

# Show container status
docker-compose ps

echo ""
echo -e "${BLUE}🌐 Service URLs:${NC}"
echo "   • API: http://localhost:10600"
echo "   • phpMyAdmin: http://localhost:8080"
echo "   • MySQL: localhost:3306"

echo ""
echo -e "${BLUE}🔧 Quick Commands:${NC}"
echo "   • Start: ./start.sh"
echo "   • Stop: ./stop.sh"
echo "   • Restart: ./restart.sh"
echo "   • Logs: ./logs.sh"
