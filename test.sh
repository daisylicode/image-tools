#!/bin/bash

echo "🚀 Testing Free Image Tools Online..."
echo "=================================="

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Test build
echo "🔨 Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Check the 'dist' folder for built files"
else
    echo "❌ Build failed!"
    exit 1
fi

# Test development server
echo "🌐 Starting development server..."
echo "📱 Open http://localhost:3000 in your browser"
echo "Press Ctrl+C to stop the server"

npm run dev