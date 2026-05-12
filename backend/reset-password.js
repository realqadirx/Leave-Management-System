const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')

// Load environment variables
dotenv.config()

// Import User model
const User = require('./models/User')

// Function to reset a user's password
async function resetPassword(email, newPassword) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ MongoDB Connected')

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      console.log(`❌ User not found: ${email}`)
      process.exit(1)
    }

    console.log(`📧 Found user: ${user.name} (${user.email})`)

    // Hash new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    // Update password directly
    await User.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    )

    console.log(`✅ Password updated successfully for ${email}`)
    console.log(`🔑 New password: ${newPassword}`)
    
    // Verify the password works
    const updatedUser = await User.findOne({ email }).select('+password')
    const isValid = await bcrypt.compare(newPassword, updatedUser.password)
    
    if (isValid) {
      console.log('✅ Password verification successful!')
    } else {
      console.log('❌ Password verification failed!')
    }

    mongoose.disconnect()
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

// Get command line arguments
const email = process.argv[2]
const newPassword = process.argv[3]

if (!email || !newPassword) {
  console.log('Usage: node reset-password.js <email> <new-password>')
  console.log('Example: node reset-password.js prem20090066870@gmail.com newpass123')
  process.exit(1)
}

// Run the password reset
resetPassword(email, newPassword)
