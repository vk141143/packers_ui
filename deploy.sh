#!/bin/bash

# Production Deployment Script
set -euo pipefail

BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"

# Cleanup function
cleanup() {
    if [ $? -ne 0 ]; then
        echo "❌ Deployment failed. Cleaning up..."
        [ -d "$BACKUP_DIR" ] && echo "Backup available at: $BACKUP_DIR"
    fi
}
trap cleanup EXIT

echo "🚀 Starting production deployment..."

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "❌ Error: .env.production file not found"
    exit 1
fi

# Validate environment variables safely
echo "🔍 Validating environment variables..."
required_vars=("VITE_CLIENT_API_URL" "VITE_CREW_API_URL")
while IFS='=' read -r key value; do
    [[ $key =~ ^[A-Z_]+$ ]] && export "$key=$value"
done < .env.production

for var in "${required_vars[@]}"; do
    if [ -z "${!var:-}" ]; then
        echo "❌ Error: $var is not set in .env.production"
        exit 1
    fi
done

# Backup existing build
if [ -d "dist" ]; then
    echo "💾 Backing up existing build..."
    mv dist "$BACKUP_DIR"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --omit=dev

# Run linting
echo "🔍 Running linting..."
npm run lint

# Build for production
echo "🏗️ Building for production..."
npm run build

# Verify build output
if [ ! -d "dist" ] || [ ! "$(ls -A dist)" ]; then
    echo "❌ Error: Build failed or dist directory is empty"
    exit 1
fi

# Basic health check
echo "🏥 Running health check..."
if [ -f "dist/index.html" ]; then
    echo "✅ Build health check passed"
else
    echo "❌ Error: index.html not found in build"
    exit 1
fi

echo "✅ Production build completed successfully!"
echo "📁 Build output is in the 'dist' directory"
echo "🌐 Ready for deployment to your web server"