# Authentication Setup Guide

## Environment Variables

Add these to your `.env.local` file:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/cqams
# Or for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/cqams

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here-min-32-chars

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=ddajpigwo
CLOUDINARY_API_KEY=833718682523624
CLOUDINARY_API_SECRET=NJm55M6wyT1oENyOmdS0yMvpohA
CLOUDINARY_URL=cloudinary://833718682523624:NJm55M6wyT1oENyOmdS0yMvpohA@ddajpigwo
```

## Authentication Flow

### 1. Initial Setup
1. Visit `/setup` to initialize the system
2. Creates permissions, roles, and super admin user
3. Default credentials: `admin@cqams.com` / `Admin@123`

### 2. Login Process
1. Visit `/login` to access the login page
2. Enter email and password
3. System verifies credentials against database
4. Creates JWT session with user info and role
5. Redirects to dashboard on success

### 3. Route Protection
- Middleware protects all routes except public ones
- Role-based access control for different sections
- Automatic redirect to login if not authenticated

## User Roles & Permissions

### Super Admin
- Full system access
- Can manage all users, roles, and settings
- Access to all modules

### HR Manager
- User management
- Leave management
- Document management
- Dashboard analytics

### Manager
- View users
- Attendance management
- Project management
- Leave approval

### Employee
- Attendance records
- Leave requests
- Document access

## API Endpoints

### Authentication
- `POST /api/auth/signin` - Login
- `POST /api/auth/signout` - Logout
- `GET /api/auth/session` - Get current session

### Setup
- `GET /api/admin/setup` - Check setup status
- `POST /api/admin/setup` - Run initial setup

## Components

### Authentication Components
- `LoginPage` - Login form with demo accounts
- `UserProfile` - Display current user info
- `LogoutButton` - Sign out functionality
- `SessionProvider` - NextAuth session context

### Usage Examples

```jsx
// Check if user is authenticated
import { useSession } from 'next-auth/react';

function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <p>Loading...</p>;
  if (!session) return <p>Not authenticated</p>;
  
  return <p>Welcome {session.user.name}!</p>;
}

// Role-based rendering
function AdminPanel() {
  const { data: session } = useSession();
  
  if (session?.user?.role?.name !== 'Super Admin') {
    return <p>Access denied</p>;
  }
  
  return <div>Admin content</div>;
}
```

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Sessions**: Secure token-based authentication
- **Route Protection**: Middleware-based access control
- **Role-based Access**: Granular permission system
- **Session Management**: Automatic session refresh
- **CSRF Protection**: Built-in NextAuth security

## Testing

### Demo Accounts
The login page includes demo account buttons for testing:
- Super Admin: `admin@cqams.com`
- HR Manager: `hr@cqams.com` (create via setup)
- Manager: `manager@cqams.com` (create via setup)
- Employee: `employee@cqams.com` (create via setup)

### Manual Testing
1. Run setup at `/setup`
2. Login with super admin credentials
3. Test role-based access by visiting different routes
4. Verify logout functionality
5. Test middleware protection by accessing protected routes without login 