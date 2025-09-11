#!/bin/bash

# Deploy script for GitHub Pages
# This script builds and deploys the project to GitHub Pages

set -e

echo "🚀 Starting deployment process for Free Image Tools Online..."

# Check if git is available
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first."
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Not in a git repository. Please run this script from the project root."
    exit 1
fi

# Build the project
echo "🔨 Building project..."
./build.sh

# Create temporary directory for gh-pages
echo "📂 Preparing deployment files..."
rm -rf gh-pages-temp
mkdir gh-pages-temp
cp -r dist/* gh-pages-temp/

# Switch to gh-pages branch
echo "🌿 Switching to gh-pages branch..."
if git show-ref --quiet refs/heads/gh-pages; then
    git checkout gh-pages
    git pull origin gh-pages
else
    git checkout --orphan gh-pages
    git rm -rf .
    touch .nojekyll
    git add .nojekyll
    git commit -m "Initial gh-pages commit"
fi

# Copy built files
echo "📋 Copying built files..."
rm -rf *
cp -r ../gh-pages-temp/* .
rm -rf ../gh-pages-temp

# Add and commit changes
echo "💾 Committing changes..."
git add .
git diff --staged --quiet || git commit -m "Deploy to GitHub Pages - $(date '+%Y-%m-%d %H:%M:%S')"

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin gh-pages

# Switch back to original branch
echo "🔙 Switching back to original branch..."
git checkout -

echo "✅ Deployment completed successfully!"
echo "🌐 Your site should be available at: https://yourusername.github.io/freeimagetools.online/"
echo "⏳ It may take a few minutes for GitHub Pages to update."