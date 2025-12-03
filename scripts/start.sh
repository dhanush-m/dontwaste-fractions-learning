#!/bin/bash

# Start script for Fractions Learning App
# This script starts both the backend server and Next.js frontend

echo "Starting Fractions Learning Application..."
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  Warning: .env.local not found. Creating from template..."
    echo "OPENAI_API_KEY=your_openai_api_key_here" > .env.local
    echo "PORT=3001" >> .env.local
    echo "NEXT_PUBLIC_API_URL=http://localhost:3001" >> .env.local
    echo "Please update .env.local with your OpenAI API key"
    echo ""
fi

# Create data directory if it doesn't exist
mkdir -p data

# Start backend server in background
echo "🚀 Starting backend server on port 3001..."
node server/index.js &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start Next.js frontend
echo "🚀 Starting Next.js frontend on port 3000..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Application started!"
echo "   Backend: http://localhost:3001"
echo "   Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT TERM
wait

