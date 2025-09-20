#!/bin/bash

# Show Docker Services Logs
# Usage: ./logs.sh [service_name]

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

SERVICE=${1:-}

echo -e "${BLUE}📋 Docker Services Logs${NC}"
echo "================================"

if [ -n "$SERVICE" ]; then
    echo "Showing logs for: $SERVICE"
    docker-compose logs -f "$SERVICE"
else
    echo "Showing logs for all services..."
    echo "Press Ctrl+C to exit"
    echo ""
    docker-compose logs -f
fi
