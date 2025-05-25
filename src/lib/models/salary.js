// src/lib/models/salary.js
import mongoose from 'mongoose';

const salarySchema = new mongoose.Schema({
  // Employee Reference
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Period Information
  month: {
    type: String,
    required: true // Format: "January 2024"
  },
  year: {
    type: Number,
    required: true
  },
  
  // Salary Components
  basicSalary: {
    type: Number,
    required: true,
    min: 0
  },
  allowances: {
    type: Number,
    default: 0,
    min: 0
  },
  bonus: {
    type: Number,
    default: 0,
    min: 0
  },
  deductions: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Calculated Fields
  grossSalary: {
    type: Number,
    default: 0
  },
  netSalary: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Payment Information
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Paid'],
    default: 'Pending'
  },
  payDate: {
    type: Date
  },
  paymentMethod: {
    type: String,
    enum: ['Bank Transfer', 'Check', 'Cash'],
    default: 'Bank Transfer'
  },
  
  // Additional Information
  workingDays: {
    type: Number,
    default: 22
  },
  actualWorkingDays: {
    type: Number
  },
  
  // Metadata
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  processedAt: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Virtual for formatted month-year
salarySchema.virtual('periodFormatted').get(function() {
  return `${this.month} ${this.year}`;
});

// Indexes
salarySchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true }); // One salary record per employee per month
salarySchema.index({ status: 1 });
salarySchema.index({ payDate: 1 });
salarySchema.index({ year: 1, month: 1 });

// Pre-save middleware to calculate gross and net salary
salarySchema.pre('save', function(next) {
  this.grossSalary = this.basicSalary + this.allowances + this.bonus;
  this.netSalary = this.grossSalary - this.deductions;
  
  // Set pay date when status changes to Paid
  if (this.status === 'Paid' && !this.payDate) {
    this.payDate = new Date();
  }
  
  next();
});

// Static method to get salary summary for a period
salarySchema.statics.getSalarySummary = function(month, year) {
  return this.aggregate([
    {
      $match: { month, year }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$netSalary' }
      }
    }
  ]);
};

const Salary = mongoose.models.Salary || mongoose.model('Salary', salarySchema);

export default Salary;
