// src/lib/models/document.js
import mongoose from 'mongoose';
import User from './user.js';

const documentSchema = new mongoose.Schema({
  // Employee Reference
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true
  },
  
  // Document Information
  documentType: {
    type: String,
    required: true,
    enum: [
      'Resume',
      'Government ID Proof',
      'Address Proof',
      'Educational Certificates'
    ]
  },
  documentUrl: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  
  // Metadata
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true
  }
}, {
  timestamps: true
});

// Simple index for queries
documentSchema.index({ employeeId: 1, documentType: 1 });

const Document = mongoose.models.Document || mongoose.model('Document', documentSchema);

export default Document;