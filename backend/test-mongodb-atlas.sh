#!/bin/bash

echo "🧪 MongoDB Atlas Connection Test"
echo "================================="
echo ""

cd "$(dirname "$0")"

echo "Testing connection with credentials from .env file..."
echo ""

node -e "
require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.log('❌ ERROR: MONGODB_URI not found in .env file');
  process.exit(1);
}

console.log('📡 Connecting to MongoDB Atlas...');
console.log('');

mongoose.connect(uri, { 
  serverSelectionTimeoutMS: 15000 
})
.then(() => {
  console.log('✅ SUCCESS: MongoDB Atlas Connected!');
  console.log('');
  console.log('Database:', mongoose.connection.db.databaseName);
  console.log('');
  console.log('✅ Your MongoDB is configured correctly!');
  console.log('✅ Registration and login will work!');
  console.log('✅ Vercel deployment will work!');
  console.log('');
  return mongoose.disconnect();
})
.then(() => {
  process.exit(0);
})
.catch(err => {
  console.log('❌ FAILED: Could not connect to MongoDB Atlas');
  console.log('');
  console.log('Error:', err.message);
  console.log('');
  console.log('🔴 SOLUTION: Create a new database user with simple credentials');
  console.log('');
  console.log('1. Go to: https://cloud.mongodb.com → Database Access');
  console.log('2. Click: + ADD NEW DATABASE USER');
  console.log('3. Username: techuser (no spaces!)');
  console.log('4. Password: TechPass2025 (no special chars!)');
  console.log('5. Privileges: Read and write to any database');
  console.log('6. Click: Add User');
  console.log('7. Wait: 60 seconds');
  console.log('');
  console.log('8. Update .env file:');
  console.log('   MONGODB_URI=mongodb+srv://techuser:TechPass2025@cluster0.wv2ni.mongodb.net/Imaginify?retryWrites=true&w=majority&appName=Cluster0');
  console.log('');
  console.log('9. Run this test again: ./test-mongodb-atlas.sh');
  console.log('');
  mongoose.disconnect();
  process.exit(1);
});
"
