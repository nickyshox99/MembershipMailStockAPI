#!/bin/bash

# Stop Docker Services
# Usage: ./stop.sh

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🛑 Stopping Docker Services...${NC}"

# Check if containers are running
if ! docker ps --format "table {{.Names}}" | grep -q "membership_mysql"; then
    echo -e "${YELLOW}⚠️  No services are currently running${NC}"
    exit 0
fi

# Stop all services
docker-compose down

echo -e "${GREEN}✅ All services stopped successfully!${NC}"
echo ""
echo "💡 Run './start.sh' to start services again"
echo "🔄 Run './restart.sh' to restart services"
