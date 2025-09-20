#!/bin/bash

# Install Docker Infrastructure
# Usage: ./install.sh

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Installing Docker Infrastructure...${NC}"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create directories
mkdir -p mysql-init
mkdir -p logs

# Copy environment file
if [ ! -f .env ]; then
    if [ -f env.template ]; then
        cp env.template .env
        echo "✅ Created .env file from template"
    fi
fi

# Copy SQL data file to mysql-init directory
if [ -f data/membership.sql ]; then
    cp data/membership.sql mysql-init/01-membership.sql
    echo "✅ Copied membership.sql to mysql-init directory"
else
    echo "⚠️  Warning: data/membership.sql not found. Database will start empty."
fi

# Pull images
echo "📥 Pulling Docker images..."
docker-compose pull

# Build API
echo "🔨 Building API image..."
docker-compose build api

# Start MySQL first to initialize database
echo "🚀 Starting MySQL to initialize database..."
docker-compose up -d mysql

# Wait for MySQL to be ready
echo "⏳ Waiting for MySQL to be ready..."
sleep 10

# Check if MySQL is ready
echo "🔍 Checking MySQL status..."
until docker-compose exec mysql mysqladmin ping -h localhost --silent; do
    echo "⏳ MySQL is not ready yet, waiting..."
    sleep 5
done

echo "✅ MySQL is ready!"

# Check if database was initialized
echo "🔍 Checking if membership database exists..."
if docker-compose exec mysql mysql -e "USE membership; SHOW TABLES;" | grep -q "address_list"; then
    echo "✅ Database initialized successfully with membership data!"
else
    echo "⚠️  Database may not have been initialized properly"
fi

echo -e "${GREEN}✅ Installation completed!${NC}"
echo "Run './start.sh' to start all services"
