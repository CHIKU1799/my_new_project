#!/bin/bash

# FoodEx Food Delivery App Startup Script
echo "🍕 Starting FoodEx Food Delivery App..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js v16 or higher.${NC}"
    exit 1
fi

if ! command_exists python3; then
    echo -e "${RED}❌ Python 3 is not installed. Please install Python 3.8 or higher.${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed. Please install npm.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All prerequisites are installed.${NC}"

# Install frontend dependencies
echo -e "${BLUE}Installing frontend dependencies...${NC}"
if npm install; then
    echo -e "${GREEN}✅ Frontend dependencies installed successfully.${NC}"
else
    echo -e "${RED}❌ Failed to install frontend dependencies.${NC}"
    exit 1
fi

# Install backend dependencies
echo -e "${BLUE}Installing backend dependencies...${NC}"
if pip3 install -r requirement.txt; then
    echo -e "${GREEN}✅ Backend dependencies installed successfully.${NC}"
else
    echo -e "${RED}❌ Failed to install backend dependencies.${NC}"
    exit 1
fi

# Create backend directory if it doesn't exist
mkdir -p backend

# Start backend server in background
echo -e "${BLUE}Starting backend server...${NC}"
cd backend
python3 ../backend/app.py > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Check if backend is running
if kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${GREEN}✅ Backend server started successfully (PID: $BACKEND_PID)${NC}"
    echo -e "${YELLOW}Backend API: http://localhost:5000${NC}"
else
    echo -e "${RED}❌ Failed to start backend server.${NC}"
    exit 1
fi

# Start frontend server
echo -e "${BLUE}Starting frontend server...${NC}"
echo -e "${YELLOW}Frontend will be available at: http://localhost:3000${NC}"
echo -e "${YELLOW}Demo credentials: demo@food.com / demo123${NC}"
echo ""
echo -e "${GREEN}🎉 FoodEx is starting up!${NC}"
echo -e "${BLUE}Press Ctrl+C to stop both servers${NC}"
echo ""

# Function to cleanup background processes
cleanup() {
    echo -e "\n${YELLOW}Shutting down servers...${NC}"
    kill $BACKEND_PID 2>/dev/null
    echo -e "${GREEN}👋 Goodbye!${NC}"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Start frontend server (this will run in foreground)
npm run dev

# If we get here, npm run dev exited, so cleanup
cleanup