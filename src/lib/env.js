// src/lib/env.js

// Environment configuration with defaults
export const env = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/cqams',
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'cqams-default-secret-key-for-development-only-change-in-production',
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'ddajpigwo',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '833718682523624',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || 'NJm55M6wyT1oENyOmdS0yMvpohA',
  CLOUDINARY_URL: process.env.CLOUDINARY_URL || 'cloudinary://833718682523624:NJm55M6wyT1oENyOmdS0yMvpohA@ddajpigwo'
};

// Validate required environment variables
export function validateEnv() {
  const required = ['MONGODB_URI'];
  const missing = required.filter(key => !process.env[key] && !env[key]);
  
  if (missing.length > 0) {
    console.warn(`⚠️ Missing environment variables: ${missing.join(', ')}`);
    console.warn('Using default values for development. Please set these in production.');
  }
  
  return env;
}

export default env; 