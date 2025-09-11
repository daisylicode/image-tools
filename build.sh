#!/bin/bash

# Build script for Free Image Tools Online
# This script builds the project and prepares it for deployment

set -e

echo "🚀 Starting build process for Free Image Tools Online..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/
rm -rf .vite/

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate sitemap
echo "🗺️  Generating sitemap..."
npm run generate-sitemap

# Build the project
echo "🔨 Building project..."
npm run build

# Copy static assets
echo "📋 Copying static assets..."
cp -r public/ dist/public/

# Create .nojekyll file for GitHub Pages
touch dist/.nojekyll

# Create CNAME file if needed (uncomment and modify if you have a custom domain)
# echo "yourdomain.com" > dist/CNAME

echo "✅ Build completed successfully!"
echo "📁 Build output: dist/"
echo "🌐 Ready for deployment!"

# Optional: Start preview server
if [ "$1" = "--preview" ]; then
    echo "🔍 Starting preview server..."
    npm run preview
fi