const express = require('express')
const router = express.Router()
const Leave = require('../models/Leave')
const User = require('../models/User')
const auth = require('../middleware/auth')

// @route   POST /api/leaves
// @desc    Create a new leave request
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { leaveType, startDate, endDate, numberOfDays, reason, attachment } = req.body

    const leave = new Leave({
      user: req.userId,
      leaveType,
      startDate,
      endDate,
      numberOfDays,
      reason,
      attachment
    })

    await leave.save()

    res.status(201).json({
      success: true,
      message: 'Leave request submitted successfully',
      leave
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    })
  }
})

// @route   GET /api/leaves
// @desc    Get all leave requests (for current user or all if coordinator/admin)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    let leaves

    if (user.role === 'faculty') {
      // Faculty can only see their own leaves
      leaves = await Leave.find({ user: req.userId })
        .populate('user', 'name email department')
        .populate('approvedBy', 'name')
        .sort({ createdAt: -1 })
    } else {
      // Coordinators and above can see all leaves
      leaves = await Leave.find()
        .populate('user', 'name email department')
        .populate('approvedBy', 'name')
        .sort({ createdAt: -1 })
    }

    res.json({
      success: true,
      count: leaves.length,
      leaves
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    })
  }
})

// @route   GET /api/leaves/:id
// @desc    Get leave by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id)
      .populate('user', 'name email department')
      .populate('approvedBy', 'name')

    if (!leave) {
      return res.status(404).json({ 
        success: false, 
        message: 'Leave request not found' 
      })
    }

    res.json({
      success: true,
      leave
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    })
  }
})

// @route   PUT /api/leaves/:id/approve
// @desc    Approve a leave request
// @access  Private (Coordinator and above)
router.put('/:id/approve', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    
    if (!['coordinator', 'chief_coordinator', 'principal'].includes(user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have permission to approve leave requests' 
      })
    }

    const leave = await Leave.findById(req.params.id)
    if (!leave) {
      return res.status(404).json({ 
        success: false, 
        message: 'Leave request not found' 
      })
    }

    leave.status = 'Approved'
    leave.approvedBy = req.userId
    leave.approverName = user.name
    leave.actionDate = new Date()

    await leave.save()

    res.json({
      success: true,
      message: 'Leave request approved successfully',
      leave
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    })
  }
})

// @route   PUT /api/leaves/:id/reject
// @desc    Reject a leave request
// @access  Private (Coordinator and above)
router.put('/:id/reject', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    
    if (!['coordinator', 'chief_coordinator', 'principal'].includes(user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have permission to reject leave requests' 
      })
    }

    const { rejectionReason } = req.body

    const leave = await Leave.findById(req.params.id)
    if (!leave) {
      return res.status(404).json({ 
        success: false, 
        message: 'Leave request not found' 
      })
    }

    leave.status = 'Rejected'
    leave.approvedBy = req.userId
    leave.approverName = user.name
    leave.actionDate = new Date()
    leave.rejectionReason = rejectionReason || 'No reason provided'

    await leave.save()

    res.json({
      success: true,
      message: 'Leave request rejected',
      leave
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    })
  }
})

// @route   DELETE /api/leaves/:id
// @desc    Cancel a leave request
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id)
    if (!leave) {
      return res.status(404).json({ 
        success: false, 
        message: 'Leave request not found' 
      })
    }

    // Only the user who created the leave can cancel it
    if (leave.user.toString() !== req.userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'You can only cancel your own leave requests' 
      })
    }

    leave.status = 'Cancelled'
    await leave.save()

    res.json({
      success: true,
      message: 'Leave request cancelled successfully'
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
