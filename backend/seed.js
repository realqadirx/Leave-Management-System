const mongoose = require('mongoose')
const dotenv = require('dotenv')
const path = require('path')
const User = require('./models/User')

// Load .env from backend directory
dotenv.config({ path: path.join(__dirname, '.env') })

const seedUsers = [
  {
    name: 'Faculty User',
    email: 'faculty@jims.edu',
    password: 'faculty123',
    role: 'faculty',
    department: 'Computer Applications',
    employeeId: 'FAC001',
    phoneNumber: '9876543210'
  },
  {
    name: 'Coordinator User',
    email: 'coordinator@jims.edu',
    password: 'coord123',
    role: 'coordinator',
    department: 'Computer Applications',
    employeeId: 'COORD001',
    phoneNumber: '9876543211'
  },
  {
    name: 'Chief Coordinator',
    email: 'chief@jims.edu',
    password: 'chief123',
    role: 'chief_coordinator',
    department: 'Administration',
    employeeId: 'CHIEF001',
    phoneNumber: '9876543212'
  },
  {
    name: 'Principal',
    email: 'principal@jims.edu',
    password: 'principal123',
    role: 'principal',
    department: 'Administration',
    employeeId: 'PRIN001',
    phoneNumber: '9876543213'
  }
]

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ MongoDB Connected')

    // Clear existing users
    await User.deleteMany({})
    console.log('🗑️  Cleared existing users')

    // Create users one by one to trigger password hashing
    console.log('🌱 Creating users...')
    for (const userData of seedUsers) {
      const user = new User(userData)
      await user.save()
      console.log(`   ✓ Created ${userData.role}: ${userData.email}`)
    }
    
    console.log('✅ Seed users created successfully')

    console.log('\n📋 Test Credentials:')
    seedUsers.forEach(user => {
      console.log(`   ${user.role}: ${user.email} / ${user.password}`)
    })

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()
