# Database Setup Guide

## MongoDB Connection Setup

### 1. Environment Variables

Create a `.env.local` file in the root directory and add:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/cqams

# For MongoDB Atlas (Cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cqams

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=ddajpigwo
CLOUDINARY_API_KEY=833718682523624
CLOUDINARY_API_SECRET=NJm55M6wyT1oENyOmdS0yMvpohA
CLOUDINARY_URL=cloudinary://833718682523624:NJm55M6wyT1oENyOmdS0yMvpohA@ddajpigwo
```

### 2. Local MongoDB Setup

#### Option A: MongoDB Community Server
1. Download and install MongoDB Community Server
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/cqams`

#### Option B: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string and replace in MONGODB_URI

### 3. Database Structure

The application uses the following collections:
- `users` - Employee information
- `attendances` - Attendance records
- `compensations` - Salary and compensation details
- `bankaccounts` - Banking information
- `documents` - Document uploads
- `systemcompliances` - System access and compliance
- `addresses` - Address information
- `roles` - User roles and permissions
- `salaries` - Salary records
- `leaverequests` - Leave applications
- `projects` - Project management

### 4. Testing Connection

After setup, test the database connection:

```bash
# Start the development server
pnpm dev

# Visit the health check endpoint
curl http://localhost:3000/api/health
```

### 5. Database Files

- `src/lib/mongodb.js` - Main connection utility
- `src/lib/db-config.js` - Configuration and health checks
- `src/lib/models/` - Mongoose schemas
- `src/app/api/health/route.js` - Health check endpoint

### 6. Connection Features

- **Connection Caching**: Prevents multiple connections in development
- **Auto-reconnection**: Handles connection drops
- **Connection Pooling**: Optimized for production
- **Error Handling**: Comprehensive error logging
- **Health Monitoring**: Built-in health check endpoint 