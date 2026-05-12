const mongoose = require('mongoose')

const leaveSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  leaveType: {
    type: String,
    enum: ['Casual Leave', 'Earned Leave', 'Marriage Leave', 'Sick Leave', 'Maternity Leave', 'Paternity Leave', 'Floater Leave', 'Unpaid Leave', 'Special Leave'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  numberOfDays: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
    default: 'Pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  approverName: {
    type: String,
    default: ''
  },
  actionDate: {
    type: Date,
    default: null
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  attachment: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Index for faster queries
leaveSchema.index({ user: 1, status: 1 })
leaveSchema.index({ startDate: 1, endDate: 1 })

module.exports = mongoose.model('Leave', leaveSchema)
