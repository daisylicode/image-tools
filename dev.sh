#!/bin/bash

# Development script for Free Image Tools Online
# This script starts the development server with additional features

set -e

echo "🚀 Starting development server for Free Image Tools Online..."

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start development server
echo "🔧 Starting development server..."
echo "🌐 Server will be available at: http://localhost:5173"
echo "📱 Mobile testing: http://localhost:5173 (use browser dev tools for mobile view)"
echo "⚡ Hot reload enabled - changes will auto-refresh"
echo "Press Ctrl+C to stop the server"

npm run dev