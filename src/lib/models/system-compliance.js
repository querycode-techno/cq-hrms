// src/lib/models/system-compliance.js
import mongoose from 'mongoose';

const systemComplianceSchema = new mongoose.Schema({
  // Employee Reference
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Software/Tool Access Required
  softwareAccess: [{
    type: String,
    enum: [
      'ERP System',
      'CRM',
      'HRMS',
      'Slack',
      'Jira',
      'GitHub',
      'Microsoft Office',
      'Google Workspace',
      'VPN Access'
    ]
  }],
  
  // Hardware Requirements
  accessCardRequired: {
    type: Boolean,
    default: false
  },
  biometricEnrollment: {
    type: Boolean,
    default: false
  },
  
  // Policy Acknowledgments
  codeOfConductAccepted: {
    type: Boolean,
    default: false
  },
  hrPoliciesAccepted: {
    type: Boolean,
    default: false
  },
  leavePolicyAccepted: {
    type: Boolean,
    default: false
  },
  itSecurityPolicyAccepted: {
    type: Boolean,
    default: false
  },
  ndaAccepted: {
    type: Boolean,
    default: false
  },
  
  // Additional Information from UI
  skills: {
    type: String,
    maxlength: 1000
  },
  medicalNeeds: {
    type: String,
    maxlength: 500
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
systemComplianceSchema.index({ employeeId: 1 });

const SystemCompliance = mongoose.models.SystemCompliance || mongoose.model('SystemCompliance', systemComplianceSchema);

export default SystemCompliance;