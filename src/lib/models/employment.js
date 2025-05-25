import mongoose from 'mongoose';
import User from './user.js';

const userSchema = new mongoose.Schema({
  // Personal Information (Required fields from PersonalInfoStep)
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true
  },

  // Employment Information (from EmploymentDetailsStep)
  designation: {
    type: String,
    trim: true,
    maxlength: 100
  },
  department: {
    type: String,
    enum: ['Engineering', 'Product', 'Design', 'Human Resources', 'Sales', 'Marketing', 'Finance', 'Operations']
  },
  dateOfJoining: {
    type: Date
  },
  employeeType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Intern', 'Consultant', 'Contract']
  },
  reportingManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true
  },
  workLocation: {
    type: String,
    enum: ['Office', 'Remote', 'Hybrid']
  },
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
userSchema.index({ employeeId: 1 });
userSchema.index({ department: 1, status: 1 });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;