#!/bin/bash

# Docker Infrastructure Management Script
# Usage: ./docker-manager.sh [install|start|stop|restart|status|logs|clean]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project directory
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="$PROJECT_DIR/docker-compose.yml"

# Functions
print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  Docker Infrastructure Manager  ${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Docker and Docker Compose are installed"
}

# Install infrastructure
install_infra() {
    print_header
    print_info "Installing Docker Infrastructure..."
    
    check_docker
    
    # Create necessary directories
    mkdir -p "$PROJECT_DIR/mysql-init"
    mkdir -p "$PROJECT_DIR/logs"
    
    # Copy environment file if it doesn't exist
    if [ ! -f "$PROJECT_DIR/.env" ]; then
        if [ -f "$PROJECT_DIR/env.template" ]; then
            cp "$PROJECT_DIR/env.template" "$PROJECT_DIR/.env"
            print_success "Created .env file from template"
        else
            print_warning "No .env file found. Please create one manually."
        fi
    fi
    
    # Pull Docker images
    print_info "Pulling Docker images..."
    docker-compose -f "$COMPOSE_FILE" pull
    
    # Build API image
    print_info "Building API image..."
    docker-compose -f "$COMPOSE_FILE" build api
    
    print_success "Infrastructure installation completed!"
    print_info "Run './docker-manager.sh start' to start all services"
}

# Start services
start_services() {
    print_header
    print_info "Starting Docker services..."
    
    check_docker
    
    # Start MySQL and phpMyAdmin first
    print_info "Starting MySQL and phpMyAdmin..."
    docker-compose -f "$COMPOSE_FILE" up -d mysql phpmyadmin
    
    # Wait for MySQL to be ready
    print_info "Waiting for MySQL to be ready..."
    sleep 10
    
    # Start API
    print_info "Starting API service..."
    docker-compose -f "$COMPOSE_FILE" up -d api
    
    print_success "All services started successfully!"
    print_info "Services available at:"
    print_info "  - API: http://localhost:10600"
    print_info "  - phpMyAdmin: http://localhost:8080"
    print_info "  - MySQL: localhost:3306"
}

# Stop services
stop_services() {
    print_header
    print_info "Stopping Docker services..."
    
    docker-compose -f "$COMPOSE_FILE" down
    
    print_success "All services stopped successfully!"
}

# Restart services
restart_services() {
    print_header
    print_info "Restarting Docker services..."
    
    stop_services
    sleep 2
    start_services
}

# Show status
show_status() {
    print_header
    print_info "Docker services status:"
    
    docker-compose -f "$COMPOSE_FILE" ps
    
    echo ""
    print_info "Service URLs:"
    print_info "  - API: http://localhost:10600"
    print_info "  - phpMyAdmin: http://localhost:8080"
    print_info "  - MySQL: localhost:3306"
}

# Show logs
show_logs() {
    print_header
    print_info "Showing Docker services logs..."
    
    docker-compose -f "$COMPOSE_FILE" logs -f
}

# Clean up
clean_up() {
    print_header
    print_warning "This will remove all containers, volumes, and images. Are you sure? (y/N)"
    read -r response
    
    if [[ "$response" =~ ^[Yy]$ ]]; then
        print_info "Cleaning up Docker resources..."
        
        # Stop and remove containers
        docker-compose -f "$COMPOSE_FILE" down -v --remove-orphans
        
        # Remove images
        docker-compose -f "$COMPOSE_FILE" down --rmi all
        
        # Remove volumes
        docker volume prune -f
        
        print_success "Cleanup completed!"
    else
        print_info "Cleanup cancelled."
    fi
}

# Main script logic
case "${1:-}" in
    install)
        install_infra
        ;;
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs
        ;;
    clean)
        clean_up
        ;;
    *)
        echo "Usage: $0 {install|start|stop|restart|status|logs|clean}"
        echo ""
        echo "Commands:"
        echo "  install  - Install Docker infrastructure"
        echo "  start    - Start all services"
        echo "  stop     - Stop all services"
        echo "  restart  - Restart all services"
        echo "  status   - Show services status"
        echo "  logs     - Show services logs"
        echo "  clean    - Clean up all Docker resources"
        exit 1
        ;;
esac
