#!/bin/bash

# SplitBill Application Launcher
# This script helps you start the application in different modes

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install Node.js and npm."
    exit 1
fi

# Display menu
show_menu() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════${NC}"
    echo -e "${BLUE}   SplitBill Application Launcher${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════${NC}"
    echo ""
    echo -e "${GREEN}1.${NC} Run in LOCAL mode (development)"
    echo -e "${GREEN}2.${NC} Run in PRODUCTION mode"
    echo -e "${GREEN}3.${NC} Run Tests (Local Mode)"
    echo -e "${GREEN}4.${NC} Run Tests (Production Mode)"
    echo -e "${GREEN}5.${NC} Run Tests Headed (Local Mode - with browser)"
    echo -e "${GREEN}6.${NC} Run Tests Headed (Production Mode - with browser)"
    echo -e "${GREEN}7.${NC} View Test Report"
    echo -e "${GREEN}8.${NC} Exit"
    echo ""
}

run_local() {
    print_info "Starting SplitBill in LOCAL MODE..."
    print_info "Backend will run on http://localhost:5001"
    print_info "Frontend will run on http://localhost:3000"
    echo ""
    print_warning "Open 3 terminals and run:"
    echo ""
    print_info "Terminal 1 (Backend):"
    echo -e "  ${YELLOW}cd server && npm run dev:local${NC}"
    echo ""
    print_info "Terminal 2 (Frontend):"
    echo -e "  ${YELLOW}cd client && npm run dev:local${NC}"
    echo ""
    print_info "Terminal 3 (Tests - optional):"
    echo -e "  ${YELLOW}cd playwright-tests && npm run test:local:headed${NC}"
    echo ""
}

run_production() {
    print_info "Starting SplitBill in PRODUCTION MODE..."
    print_warning "Make sure backend is running on production server"
    print_info "Frontend will connect to: https://splitbill-api2.onrender.com"
    echo ""
    print_info "Run:"
    echo -e "  ${YELLOW}cd client && npm run dev:prod${NC}"
    echo ""
}

run_tests_local() {
    print_info "Running tests in LOCAL mode..."
    cd playwright-tests
    npm run test:local
}

run_tests_prod() {
    print_info "Running tests in PRODUCTION mode..."
    cd playwright-tests
    npm run test:production
}

run_tests_local_headed() {
    print_info "Running tests in LOCAL mode with browser..."
    cd playwright-tests
    npm run test:local:headed
}

run_tests_prod_headed() {
    print_info "Running tests in PRODUCTION mode with browser..."
    cd playwright-tests
    npm run test:prod:headed
}

view_report() {
    print_info "Opening test report..."
    cd playwright-tests
    npm run report
}

# Main loop
while true; do
    show_menu
    read -p "Choose an option (1-8): " choice
    echo ""
    
    case $choice in
        1)
            run_local
            ;;
        2)
            run_production
            ;;
        3)
            run_tests_local
            ;;
        4)
            run_tests_prod
            ;;
        5)
            run_tests_local_headed
            ;;
        6)
            run_tests_prod_headed
            ;;
        7)
            view_report
            ;;
        8)
            print_success "Goodbye!"
            exit 0
            ;;
        *)
            print_error "Invalid option. Please try again."
            ;;
    esac
done
