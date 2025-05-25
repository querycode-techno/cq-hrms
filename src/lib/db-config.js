/**
 * Database Configuration
 * Add these environment variables to your .env.local file:
 * 
 * MONGODB_URI=mongodb://localhost:27017/cqams
 * # For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/cqams
 */

export const dbConfig = {
  // Database name
  dbName: 'cqams',
  
  // Connection options
  options: {
    bufferCommands: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
  },
  
  // Collections
  collections: {
    users: 'users',
    attendance: 'attendances',
    compensation: 'compensations',
    bankAccounts: 'bankaccounts',
    documents: 'documents',
    systemCompliance: 'systemcompliances',
    addresses: 'addresses',
    roles: 'roles',
    salaries: 'salaries',
    leaveRequests: 'leaverequests',
    projects: 'projects',
  }
};

// Database connection status
export const getConnectionStatus = () => {
  const mongoose = require('mongoose');
  return {
    isConnected: mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    name: mongoose.connection.name,
  };
};

// Database health check
export const healthCheck = async () => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database not connected');
    }
    
    // Simple ping to check if database is responsive
    await mongoose.connection.db.admin().ping();
    
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      connection: getConnectionStatus(),
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
}; 