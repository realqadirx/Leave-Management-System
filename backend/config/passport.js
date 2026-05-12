const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const GitHubStrategy = require('passport-github2').Strategy
const User = require('../models/User')

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id)
})

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch (error) {
    done(error, null)
  }
})

// Google OAuth Strategy
console.log('🔍 Checking Google OAuth credentials...')
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✓ Found' : '✗ Missing')
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✓ Found' : '✗ Missing')

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  console.log('✅ Registering Google OAuth Strategy')
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID.trim(),
        clientSecret: process.env.GOOGLE_CLIENT_SECRET.trim(),
        callbackURL: (process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback').trim()
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await User.findOne({
            $or: [
              { email: profile.emails[0].value },
              { googleId: profile.id }
            ]
          })

          if (user) {
            // Update Google ID if not set
            if (!user.googleId) {
              user.googleId = profile.id
              await user.save()
            }
            return done(null, user)
          }

          // Create new user
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profileImage: profile.photos[0]?.value,
            role: 'faculty', // Default role for OAuth users
            isActive: true,
            // OAuth users don't have password
            password: Math.random().toString(36).slice(-12) // Random password (won't be used)
          })

          done(null, user)
        } catch (error) {
          done(error, null)
        }
      }
    )
  )
} else {
  console.log('❌ Google OAuth Strategy NOT registered - missing credentials')
}

// GitHub OAuth Strategy
console.log('🔍 Checking GitHub OAuth credentials...')
console.log('GITHUB_CLIENT_ID:', process.env.GITHUB_CLIENT_ID ? '✓ Found' : '✗ Missing')
console.log('GITHUB_CLIENT_SECRET:', process.env.GITHUB_CLIENT_SECRET ? '✓ Found' : '✗ Missing')

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  console.log('✅ Registering GitHub OAuth Strategy')
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID.trim(),
        clientSecret: process.env.GITHUB_CLIENT_SECRET.trim(),
        callbackURL: (process.env.GITHUB_CALLBACK_URL || 'http://localhost:5000/api/auth/github/callback').trim(),
        scope: ['user:email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // GitHub might not return email in profile, need to get from emails array
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null
          
          if (!email) {
            return done(new Error('No email found from GitHub'), null)
          }

          // Check if user already exists
          let user = await User.findOne({
            $or: [
              { email },
              { githubId: profile.id }
            ]
          })

          if (user) {
            // Update GitHub ID if not set
            if (!user.githubId) {
              user.githubId = profile.id
              await user.save()
            }
            return done(null, user)
          }

          // Create new user
          user = await User.create({
            githubId: profile.id,
            name: profile.displayName || profile.username,
            email,
            profileImage: profile.photos[0]?.value,
            role: 'faculty', // Default role for OAuth users
            isActive: true,
            // OAuth users don't have password
            password: Math.random().toString(36).slice(-12) // Random password (won't be used)
          })

          done(null, user)
        } catch (error) {
          done(error, null)
        }
      }
    )
  )
} else {
  console.log('❌ GitHub OAuth Strategy NOT registered - missing credentials')
}

module.exports = passport
