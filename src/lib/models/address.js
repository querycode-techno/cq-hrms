// src/lib/models/address.js
import mongoose from 'mongoose';
import User from './user.js';

const addressSchema = new mongoose.Schema({
  // Employee Reference
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true
  },
  
  // Address Type
  addressType: {
    type: String,
    required: true,
    enum: ['Permanent', 'Current', 'Temporary', 'Emergency', 'Office'],
    default: 'Permanent'
  },
  
  // Address Components
  addressLine1: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  addressLine2: {
    type: String,
    trim: true,
    maxlength: 200
  },
  landmark: {
    type: String,
    trim: true,
    maxlength: 100
  },
  city: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  state: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  country: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    default: 'India'
  },
  pinCode: {
    type: String,
    required: true,
    trim: true,
    match: [/^[0-9]{6}$/, 'Please enter a valid 6-digit postal code']
  },
  
  // Geographic Coordinates (optional)
  coordinates: {
    latitude: {
      type: Number,
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180
    }
  },

  // Additional Information
  contactPerson: {
    name: {
      type: String,
      trim: true,
      maxlength: 100
    },
    phoneNumber: {
      type: String,
      trim: true
    },
    relationship: {
      type: String,
      enum: ['Self', 'Spouse', 'Parent', 'Sibling', 'Guardian', 'Other']
    }
  },
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full address
addressSchema.virtual('fullAddress').get(function() {
  const parts = [
    this.addressLine1,
    this.addressLine2,
    this.landmark,
    this.city,
    this.state,
    this.country,
    this.pincode
  ].filter(Boolean);
  
  return parts.join(', ');
});

// Virtual for formatted address (multi-line)
addressSchema.virtual('formattedAddress').get(function() {
  let address = this.addressLine1;
  if (this.addressLine2) address += '\n' + this.addressLine2;
  if (this.landmark) address += '\n' + this.landmark;
  address += '\n' + this.city + ', ' + this.state;
  address += '\n' + this.country + ' - ' + this.pincode;
  return address;
});

// Indexes
addressSchema.index({ employeeId: 1, addressType: 1 });
addressSchema.index({ pincode: 1 });
addressSchema.index({ city: 1, state: 1 });

// Method to validate postal code format based on country
addressSchema.methods.validatePostalCode = function() {
  const postalCodePatterns = {
    'India': /^[0-9]{6}$/,
    'USA': /^[0-9]{5}(-[0-9]{4})?$/,
    'UK': /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}$/i,
    'Canada': /^[A-Z][0-9][A-Z]\s?[0-9][A-Z][0-9]$/i
  };
  
  const pattern = postalCodePatterns[this.country];
  if (pattern) {
    return pattern.test(this.pincode);
  }
  return true; // If no pattern defined, assume valid
};

const Address = mongoose.models.Address || mongoose.model('Address', addressSchema);

export default Address;