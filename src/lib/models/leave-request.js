// src/lib/models/leave-request.js
import mongoose from 'mongoose';

const leaveRequestSchema = new mongoose.Schema({
  // Employee Reference
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Leave Details
  leaveType: {
    type: String,
    required: true,
    enum: ['Annual Leave', 'Sick Leave', 'Personal Leave', 'Emergency Leave', 'Maternity Leave', 'Paternity Leave']
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  
  // Calculated Fields
  totalDays: {
    type: Number,
    required: true,
    min: 1
  },
  
  // Request Information
  reason: {
    type: String,
    required: true,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  
  // Approval Information
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  rejectionReason: {
    type: String,
    maxlength: 300
  },
  
  // Supporting Documents
  attachments: [{
    fileName: String,
    filePath: String,
    fileSize: Number
  }],
  
  // Emergency Contact (for emergency leaves)
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  
  // Metadata
  appliedDate: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Virtual for formatted date range
leaveRequestSchema.virtual('dateRange').get(function() {
  const start = this.startDate.toISOString().split('T')[0];
  const end = this.endDate.toISOString().split('T')[0];
  return start === end ? start : `${start} to ${end}`;
});

// Indexes
leaveRequestSchema.index({ employeeId: 1, startDate: 1 });
leaveRequestSchema.index({ status: 1 });
leaveRequestSchema.index({ leaveType: 1 });
leaveRequestSchema.index({ appliedDate: -1 });

// Pre-save middleware to calculate total days
leaveRequestSchema.pre('save', function(next) {
  if (this.startDate && this.endDate) {
    const diffTime = this.endDate - this.startDate;
    this.totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
  }
  
  // Set approval timestamp
  if (this.status === 'Approved' && !this.approvedAt) {
    this.approvedAt = new Date();
  }
  
  next();
});

// Static method to get leave summary for an employee
leaveRequestSchema.statics.getEmployeeLeaveBalance = function(employeeId, year) {
  return this.aggregate([
    {
      $match: {
        employeeId: new mongoose.Types.ObjectId(employeeId),
        status: 'Approved',
        $expr: {
          $eq: [{ $year: '$startDate' }, year]
        }
      }
    },
    {
      $group: {
        _id: '$leaveType',
        totalDays: { $sum: '$totalDays' }
      }
    }
  ]);
};

// Static method to check for overlapping leaves
leaveRequestSchema.statics.checkOverlap = function(employeeId, startDate, endDate, excludeId = null) {
  const query = {
    employeeId,
    status: { $in: ['Pending', 'Approved'] },
    $or: [
      { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
    ]
  };
  
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  
  return this.findOne(query);
};

const LeaveRequest = mongoose.models.LeaveRequest || mongoose.model('LeaveRequest', leaveRequestSchema);

export default LeaveRequest;
