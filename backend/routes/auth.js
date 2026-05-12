const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['faculty', 'coordinator', 'chief_coordinator', 'principal']).withMessage('Invalid role')
], async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const { name, email, password, role, department, employeeId, phoneNumber } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email already exists' 
      })
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role,
      department,
      employeeId,
      phoneNumber
    })

    await user.save()

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration',
      error: error.message 
    })
  }
})

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('role').isIn(['faculty', 'coordinator', 'chief_coordinator', 'principal']).withMessage('Invalid role')
], async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const { email, password, role } = req.body
    
    console.log('Login attempt:', { email, role, passwordLength: password?.length })

    // Find user by email and include password field
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      console.log('User not found:', email)
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      })
    }
    
    console.log('User found:', { email: user.email, role: user.role, hasPassword: !!user.password })

    // Check if user is active
    if (!user.isActive) {
      console.log('User is inactive:', email)
      return res.status(403).json({ 
        success: false, 
        message: 'Your account has been deactivated. Please contact administrator.' 
      })
    }

    // Verify password
    console.log('Comparing passwords...')
    const isPasswordValid = await user.comparePassword(password)
    console.log('Password valid:', isPasswordValid)
    
    if (!isPasswordValid) {
      console.log('Password comparison failed for:', email)
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      })
    }

    // Verify role matches
    if (user.role !== role) {
      return res.status(403).json({ 
        success: false, 
        message: `This account is registered as ${user.role}, not ${role}` 
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        employeeId: user.employeeId,
        profileImage: user.profileImage,
        leaveBalance: user.leaveBalance
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login',
      error: error.message 
    })
  }
})

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', async (req, res) => {
  try {
    // Extract token from header
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      })
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        employeeId: user.employeeId,
        profileImage: user.profileImage,
        leaveBalance: user.leaveBalance
      }
    })
  } catch (error) {
    console.error('Auth error:', error)
    res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    })
  }
})

module.exports = router
