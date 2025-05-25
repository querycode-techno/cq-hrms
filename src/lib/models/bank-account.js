// src/lib/models/bank-account.js
import mongoose from 'mongoose';

const bankAccountSchema = new mongoose.Schema({
  // Employee Reference
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Bank Account Details
  accountNumber: {
    type: String,
    required: true,
    trim: true,
    minlength: 9,
    maxlength: 18
  },
  accountHolderName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  bankName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  branchName: {
    type: String,
    trim: true,
    maxlength: 100
  },
  ifscCode: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Please enter a valid IFSC code']
  },
  
  // Account Type
  accountType: {
    type: String,
    enum: ['Savings', 'Current', 'Salary'],
    default: 'Savings'
  },
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
bankAccountSchema.index({ employeeId: 1, isPrimary: 1 });
bankAccountSchema.index({ accountNumber: 1, ifscCode: 1 }, { unique: true });
    
// Pre-save middleware to ensure only one primary account per employee
bankAccountSchema.pre('save', async function(next) {
  if (this.isPrimary && this.isModified('isPrimary')) {
    // Set all other accounts for this employee as non-primary
    await this.constructor.updateMany(
      { 
        employeeId: this.employeeId, 
        _id: { $ne: this._id } 
      },
      { isPrimary: false }
    );
  }
  next();
});

// Virtual for masked account number
bankAccountSchema.virtual('maskedAccountNumber').get(function() {
  if (!this.accountNumber) return '';
  const accountNum = this.accountNumber.toString();
  if (accountNum.length <= 4) return accountNum;
  return 'XXXX' + accountNum.slice(-4);
});

const BankAccount = mongoose.models.BankAccount || mongoose.model('BankAccount', bankAccountSchema);

export default BankAccount;