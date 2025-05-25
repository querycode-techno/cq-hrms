import mongoose from 'mongoose';
import Role from './role.js';

const userSchema = new mongoose.Schema({
  // Personal Information (Required fields from PersonalInfoStep)
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  middleName: {
    type: String,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say']
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  
  // Contact Information
  primaryContact: {
    type: String,
    required: true,
    trim: true
  },
  personalEmail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  // Authentication
  password: {
    type: String,
    required: false, // Optional for now, will be set during setup or user creation
    minlength: 6
  },

  // System Information
  employeeId: {
    type: String,
    unique: true,
    sparse: true
  },
  department: {
    type: String,
    trim: true,
    maxlength: 100
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Terminated', 'On Leave'],
    default: 'Active'
  },
  
  // Role and Permissions (keeping the proper reference)
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  
  // Profile Information
  profileImage: {
    type: String, // URL to profile image
    default: null
  },
  
  // Metadata - using string reference to avoid circular dependency
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow null for super admin creation
  }
}, {
  timestamps: true
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  const parts = [this.firstName, this.middleName, this.lastName].filter(Boolean);
  return parts.join(' ');
});

// Indexes for better query performance
userSchema.index({ personalEmail: 1 });
userSchema.index({ employeeId: 1 });
    
// Pre-save middleware to generate employee ID
userSchema.pre('save', async function(next) {
  if (this.isNew && !this.employeeId) {
    const count = await this.constructor.countDocuments();
    this.employeeId = `EMP${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;