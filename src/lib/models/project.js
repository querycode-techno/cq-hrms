// src/lib/models/project.js
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  // Project Basic Information
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  
  // Project Timeline
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  
  // Project Status and Progress
  status: {
    type: String,
    enum: ['Planning', 'In Progress', 'Completed', 'On Hold', 'Cancelled'],
    default: 'Planning'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  
  // Task Management
  totalTasks: {
    type: Number,
    default: 0,
    min: 0
  },
  completedTasks: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Team Assignment
  assignedMembers: [{
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['Project Manager', 'Developer', 'Designer', 'Tester', 'Analyst', 'Team Lead'],
      default: 'Developer'
    },
    assignedDate: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Project Manager
  projectManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Project Details
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  budget: {
    type: Number,
    min: 0
  },
  client: {
    name: String,
    email: String,
    phone: String
  },
  
  // Project Categories/Tags
  category: {
    type: String,
    enum: ['Web Development', 'Mobile App', 'Database', 'Security', 'Infrastructure', 'Design', 'Other'],
    default: 'Other'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  // Project Resources
  attachments: [{
    fileName: String,
    filePath: String,
    fileSize: Number,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
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

// Virtual for project duration in days
projectSchema.virtual('durationDays').get(function() {
  if (!this.startDate || !this.endDate) return 0;
  const diffTime = this.endDate - this.startDate;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for days remaining
projectSchema.virtual('daysRemaining').get(function() {
  if (!this.endDate) return null;
  const today = new Date();
  const diffTime = this.endDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for team size
projectSchema.virtual('teamSize').get(function() {
  return this.assignedMembers ? this.assignedMembers.length : 0;
});

// Virtual for completion percentage based on tasks
projectSchema.virtual('taskCompletionPercentage').get(function() {
  if (this.totalTasks === 0) return 0;
  return Math.round((this.completedTasks / this.totalTasks) * 100);
});

// Indexes
projectSchema.index({ status: 1 });
projectSchema.index({ startDate: 1, endDate: 1 });
projectSchema.index({ projectManager: 1 });
projectSchema.index({ 'assignedMembers.employeeId': 1 });
projectSchema.index({ category: 1 });
projectSchema.index({ priority: 1 });

// Pre-save middleware to update progress based on tasks
projectSchema.pre('save', function(next) {
  if (this.totalTasks > 0) {
    this.progress = Math.round((this.completedTasks / this.totalTasks) * 100);
  }
  
  // Auto-complete project if all tasks are done
  if (this.completedTasks === this.totalTasks && this.totalTasks > 0 && this.status !== 'Completed') {
    this.status = 'Completed';
  }
  
  next();
});

// Static method to get projects by status
projectSchema.statics.getProjectsByStatus = function(status) {
  return this.find({ status }).populate('projectManager assignedMembers.employeeId', 'firstName lastName');
};

// Static method to get employee's projects
projectSchema.statics.getEmployeeProjects = function(employeeId) {
  return this.find({
    $or: [
      { projectManager: employeeId },
      { 'assignedMembers.employeeId': employeeId }
    ]
  }).populate('projectManager assignedMembers.employeeId', 'firstName lastName');
};

// Instance method to add team member
projectSchema.methods.addTeamMember = function(employeeId, role = 'Developer') {
  const exists = this.assignedMembers.some(member => 
    member.employeeId.toString() === employeeId.toString()
  );
  
  if (!exists) {
    this.assignedMembers.push({ employeeId, role });
    return this.save();
  }
  return this;
};

// Instance method to remove team member
projectSchema.methods.removeTeamMember = function(employeeId) {
  this.assignedMembers = this.assignedMembers.filter(member => 
    member.employeeId.toString() !== employeeId.toString()
  );
  return this.save();
};

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

export default Project;
