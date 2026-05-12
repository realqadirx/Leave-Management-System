const mongoose = require('mongoose');

// Test different connection strings
const connections = [
  {
    name: 'Original from frontend .env',
    uri: 'mongodb+srv://Prem:Prem$1710@cluster0.wv2ni.mongodb.net/?appName=Cluster0'
  },
  {
    name: 'URL encoded password',
    uri: 'mongodb+srv://Prem:Prem%241710@cluster0.wv2ni.mongodb.net/techtimeoff?retryWrites=true&w=majority&appName=Cluster0'
  }
];

async function testConnection(config) {
  console.log(`\n🔍 Testing: ${config.name}`);
  console.log(`URI: ${config.uri.replace(/:[^:@]+@/, ':****@')}`);
  
  try {
    await mongoose.connect(config.uri, { 
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 10000 
    });
    console.log('✅ SUCCESS! Connected to MongoDB Atlas');
    await mongoose.connection.close();
    return true;
  } catch (err) {
    console.log('❌ FAILED!');
    console.log('Error:', err.name);
    
    if (err.message.includes('authentication failed')) {
      console.log('❌ Reason: Wrong username or password');
      console.log('💡 Solution: Check your MongoDB Atlas credentials');
    } else if (err.message.includes('Could not connect') || err.message.includes('whitelist')) {
      console.log('❌ Reason: IP not whitelisted or still propagating');
      console.log('💡 Solution: Wait 2-3 minutes after adding 0.0.0.0/0, then try again');
    } else if (err.message.includes('ENOTFOUND') || err.message.includes('getaddrinfo')) {
      console.log('❌ Reason: Cannot resolve MongoDB Atlas hostname');
      console.log('💡 Solution: Check internet connection');
    } else {
      console.log('Message:', err.message.substring(0, 150));
    }
    
    await mongoose.connection.close();
    return false;
  }
}

async function runTests() {
  console.log('🚀 MongoDB Atlas Connection Test\n');
  console.log('Testing multiple connection strings...\n');
  
  for (const config of connections) {
    const success = await testConnection(config);
    if (success) {
      console.log('\n✅ Found working connection!');
      console.log('Use this URI in your .env file');
      process.exit(0);
    }
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n\n❌ All connection attempts failed');
  console.log('\n📋 Troubleshooting Checklist:');
  console.log('1. ✓ Go to MongoDB Atlas → Network Access');
  console.log('2. ✓ Verify 0.0.0.0/0 is in the IP whitelist');
  console.log('3. ✓ Wait 2-3 minutes for changes to propagate');
  console.log('4. ✓ Check cluster is not paused (Database → Cluster0 should be green)');
  console.log('5. ✓ Verify username: Prem, password: Prem$1710');
  console.log('6. ✓ Check internet connection');
  
  process.exit(1);
}

runTests();
