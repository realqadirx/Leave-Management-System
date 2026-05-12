const express = require('express')
const router = express.Router()
const User = require('../models/User')
const auth = require('../middleware/auth')

// @route   GET /api/users
// @desc    Get all users (for coordinators/admin)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.json({
      success: true,
      count: users.length,
      users
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    })
  }
})

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      })
    }
    res.json({
      success: true,
      user
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    })
  }
})

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, department, phoneNumber, profileImage } = req.body
    
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      })
    }

    // Update fields
    if (name) user.name = name
    if (department) user.department = department
    if (phoneNumber) user.phoneNumber = phoneNumber
    if (profileImage) user.profileImage = profileImage

    await user.save()

    res.json({
      success: true,
      message: 'User updated successfully',
      user
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    })
  }
})

module.exports = router
