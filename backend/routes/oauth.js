const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const jwt = require('jsonwebtoken')

// @route   GET /api/auth/google
// @desc    Initiate Google OAuth
// @access  Public
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false
  })
)

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public

router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    // Handle authentication errors
    if (err) {
      console.error('❌ Google OAuth authentication error:')
      console.error('Error details:', JSON.stringify(err, null, 2))
      console.error('Error message:', err.message)
      console.error('Error stack:', err.stack)
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_error&message=${encodeURIComponent(err.message || 'Unknown error')}`)
    }

    // Handle no user (authentication failed)
    if (!user) {
      console.error('❌ Google OAuth: No user returned')
      console.error('Info details:', JSON.stringify(info, null, 2))
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed&message=${encodeURIComponent(info?.message || 'No user')}`)
    }

    try {
      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )

      console.log('✅ Google OAuth successful for user:', user.email)
      
      // Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}&provider=google`)
    } catch (error) {
      console.error('Google OAuth token generation error:', error)
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=token_generation_failed`)
    }
  })(req, res, next)
})

// @route   GET /api/auth/github
// @desc    Initiate GitHub OAuth
// @access  Public
router.get('/github',
  passport.authenticate('github', { 
    scope: ['user:email'],
    session: false
  })
)

// @route   GET /api/auth/github/callback
// @desc    GitHub OAuth callback
// @access  Public
router.get('/github/callback', (req, res, next) => {
  passport.authenticate('github', { session: false }, (err, user, info) => {
    // Handle authentication errors
    if (err) {
      console.error('❌ GitHub OAuth authentication error:')
      console.error('Error details:', JSON.stringify(err, null, 2))
      console.error('Error message:', err.message)
      console.error('Error stack:', err.stack)
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=github_auth_error&message=${encodeURIComponent(err.message || 'Unknown error')}`)
    }

    // Handle no user (authentication failed)
    if (!user) {
      console.error('❌ GitHub OAuth: No user returned')
      console.error('Info details:', JSON.stringify(info, null, 2))
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=github_auth_failed&message=${encodeURIComponent(info?.message || 'No user')}`)
    }

    try {
      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )

      console.log('✅ GitHub OAuth successful for user:', user.email)
      
      // Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}&provider=github`)
    } catch (error) {
      console.error('GitHub OAuth token generation error:', error)
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=token_generation_failed`)
    }
  })(req, res, next)
})

module.exports = router
