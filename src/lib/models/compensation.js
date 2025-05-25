// src/lib/models/compensation.js
import mongoose from 'mongoose';

const compensationSchema = new mongoose.Schema({
  // Employee Reference
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Salary Components
  ctc: {
    type: Number,
    min: 0
  },
  basicSalary: {
    type: Number,
    min: 0
  },
  hra: {
    type: Number,
    min: 0
  },
  
  // Payment Information
  paymentCycle: {
    type: String,
    enum: ['Monthly', 'Bi-weekly', 'Weekly'],
    default: 'Monthly'
  },
  
  // Tax Information
  panNumber: {
    type: String,
    trim: true,
    uppercase: true
  },
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Simple index for queries
compensationSchema.index({ employeeId: 1 });

const Compensation = mongoose.models.Compensation || mongoose.model('Compensation', compensationSchema);

export default Compensation;