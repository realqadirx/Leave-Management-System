#!/bin/bash

echo "🚀 TechTimeOff Backend Quick Start"
echo "=================================="
echo ""

# Check if MongoDB is running
echo "📊 Checking MongoDB..."
if pgrep -x mongod > /dev/null; then
    echo "✅ MongoDB is running"
else
    echo "⚠️  MongoDB is not running. Starting MongoDB..."
    brew services start mongodb-community@7.0 2>/dev/null || mongod --fork --dbpath ~/data/db --logpath ~/data/mongodb.log 2>/dev/null
    sleep 2
fi

# Navigate to backend directory
cd "$(dirname "$0")"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if database needs seeding
echo ""
read -p "Do you want to seed the database with test users? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Seeding database..."
    node seed.js
fi

echo ""
echo "🚀 Starting backend server..."
echo "=================================="
npm run dev
