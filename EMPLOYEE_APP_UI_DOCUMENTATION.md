# CQAMS Employee App UI Documentation

## Overview

The CQAMS (Company Quality Assurance Management System) Employee App is a comprehensive Next.js-based web application designed for employee self-service and management. The app provides employees with access to their personal information, attendance tracking, salary details, leave management, and project assignments.

## Architecture & Technology Stack

- **Framework**: Next.js 14 with App Router
- **Authentication**: NextAuth.js with credentials provider
- **Database**: MongoDB with Mongoose ODM
- **UI Components**: Shadcn/ui with Tailwind CSS
- **File Storage**: Cloudinary for image uploads
- **State Management**: React hooks and context
- **Permissions**: Role-based access control (RBAC)

## Core Features & UI Components

### 1. Authentication System

#### Login Page (`/login`)
- **Location**: `src/app/login/page.jsx`
- **Features**:
  - Email/password authentication
  - Password visibility toggle
  - Demo login buttons for different roles
  - Responsive design with company branding
  - Error handling and validation
  - Auto-redirect for authenticated users

```jsx
// Key UI Elements:
- Company logo and branding
- Email input field
- Password input with show/hide toggle
- Login button with loading state
- Demo role buttons (Super Admin, HR Manager, Manager, Employee)
- Error alerts
- Redirect handling
```

#### Registration
- Currently handled through admin panel
- Employee accounts created during onboarding process
- Password setup during first login

### 2. Dashboard Layout

#### Main Layout (`src/app/(dashboard)/layout.jsx`)
- **Features**:
  - Responsive sidebar navigation
  - Top navigation bar with user menu
  - Theme toggle (dark/light mode)
  - Authentication guards
  - Loading states

```jsx
// Layout Structure:
- Fixed sidebar (hidden on mobile)
- Main content area with top bar
- User navigation dropdown
- Theme toggle
- Responsive design
```

#### Navigation (`src/components/main-nav.jsx`)
- **Permission-based menu items**:
  - Dashboard (always visible)
  - Employees (admin/HR only)
  - Attendance (all users)
  - Projects (all users)
  - Leave Requests (all users)
  - Salary (all users)
  - Roles (admin only)
  - Admin Panel (admin only)
  - Notifications (all users)
  - Settings (always visible)

### 3. Employee Profile & Settings

#### Profile Management (`src/app/(dashboard)/settings/page.jsx`)
- **Features**:
  - Personal information editing
  - Profile photo upload
  - Contact details management
  - Account information display
  - Security settings

```jsx
// Profile UI Components:
- Avatar with photo upload
- Personal info form (name, email, phone, department)
- Account details (last login, member since)
- Edit/save functionality
- Notification preferences
- Security settings
```

#### User Navigation (`src/components/user-nav.jsx`)
- **Dropdown menu with**:
  - User avatar and basic info
  - Employee ID display
  - Role badge
  - Profile link
  - Settings link
  - Logout option

### 4. Attendance Management

#### Punch In/Out System (`src/app/(dashboard)/attendance/page.jsx`)
- **Core Features**:
  - Real-time punch in/out buttons
  - Photo capture for attendance
  - Location tracking (Office/Remote/Field)
  - Status indicators (Present/Late/Absent)
  - Attendance history view

```jsx
// Attendance UI Components:
- Punch In/Out buttons with status
- Photo capture dialog
- Location selection
- Time display
- Status badges
- Attendance records table
```

#### Geolocation & Photo Features
- **Location Tracking**:
  - GPS coordinates capture
  - Location type selection (Office/Remote/Field)
  - Address validation
  - Geofencing capabilities (planned)

```jsx
// Location Schema (from attendance model):
location: {
  type: { type: String, enum: ['Office', 'Remote', 'Field'] },
  name: { type: String, required: true },
  coordinates: {
    type: { type: String, enum: ['Point'] },
    lngnlat: { type: [Number, Number], required: true }
  }
}
```

- **Photo Capture**:
  - Camera integration for punch in/out
  - Image upload to Cloudinary
  - Automatic image optimization
  - Secure storage with employee ID organization

```jsx
// Cloudinary Integration:
- Upload path: cqams/attendance/{employeeId}/{date}/{type}-{timestamp}
- Image optimization (800x600, auto quality)
- Secure URLs with transformation
```

#### Attendance History
- **Features**:
  - Daily attendance records
  - Monthly/weekly views
  - Filter by date range
  - Export functionality
  - Edit capabilities (admin only)

### 5. Salary & Payment History

#### Salary Dashboard (`src/app/(dashboard)/salary/page.jsx`)
- **Features**:
  - Current month salary details
  - Payment history
  - Salary breakdown (basic, HRA, deductions)
  - Download payslips
  - Tax information

```jsx
// Salary UI Components:
- Current salary card
- Payment history table
- Salary breakdown charts
- Download buttons
- Tax summary
```

### 6. Leave Management

#### Leave Requests (`src/app/(dashboard)/leaves/page.jsx`)
- **Features**:
  - Submit new leave requests
  - View leave history
  - Track approval status
  - Leave balance display
  - Calendar integration

```jsx
// Leave UI Components:
- Leave request form
- Leave type selection
- Date range picker
- Reason text area
- Status badges
- Leave balance cards
```

### 7. Project Management

#### Assigned Projects (`src/app/(dashboard)/projects/page.jsx`)
- **Features**:
  - View assigned projects
  - Project details and timelines
  - Task management
  - Team member information
  - Progress tracking

```jsx
// Project UI Components:
- Project cards
- Progress bars
- Team member avatars
- Task lists
- Timeline views
```

## Mobile Responsiveness

### Design Principles
- **Mobile-first approach**
- **Touch-friendly interfaces**
- **Responsive breakpoints**:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

### Mobile-Specific Features
- **Collapsible sidebar navigation**
- **Touch-optimized buttons**
- **Swipe gestures for navigation**
- **Camera integration for attendance**
- **GPS location services**

## Security Features

### Authentication & Authorization
- **JWT-based session management**
- **Role-based access control (RBAC)**
- **Permission-based UI rendering**
- **Secure API endpoints**

### Data Protection
- **Encrypted password storage**
- **Secure image uploads**
- **HTTPS enforcement**
- **Input validation and sanitization**

## Performance Optimizations

### Frontend Optimizations
- **Next.js App Router for optimal loading**
- **Component lazy loading**
- **Image optimization with Cloudinary**
- **Efficient state management**

### Backend Optimizations
- **MongoDB connection pooling**
- **Indexed database queries**
- **Cached API responses**
- **Optimized image delivery**

## API Integration

### Employee-Specific Endpoints
```javascript
// Authentication
POST /api/auth/signin
POST /api/auth/signout

// Profile Management
GET /api/user/profile
PUT /api/user/profile
POST /api/user/upload-avatar

// Attendance
GET /api/attendance/punch (get status)
POST /api/attendance/punch (punch in/out)
GET /api/attendance (history)

// Salary
GET /api/salary/current
GET /api/salary/history
GET /api/salary/payslip/:id

// Leave Requests
GET /api/leaves
POST /api/leaves
PUT /api/leaves/:id

// Projects
GET /api/projects/assigned
GET /api/projects/:id
```

## Database Schema Overview

### User Model (`src/lib/models/user.js`)
```javascript
{
  // Personal Information
  firstName: String (required),
  middleName: String,
  lastName: String (required),
  dateOfBirth: Date (required),
  gender: String (required, enum),
  bloodGroup: String (enum),
  
  // Contact Information
  primaryContact: String (required),
  personalEmail: String (required, unique),
  
  // System Information
  employeeId: String (unique),
  department: String,
  status: String (enum: Active/Inactive/Terminated/On Leave),
  role: ObjectId (ref: Role),
  profileImage: String (URL),
  
  // Metadata
  createdBy: ObjectId (ref: User),
  timestamps: true
}
```

### Attendance Model (`src/lib/models/attendance.js`)
```javascript
{
  employeeId: ObjectId (ref: User, required),
  date: Date (required),
  checkIn: Date (required),
  checkOut: Date (required),
  totalHours: Number (in minutes),
  status: String (enum: Present/Absent/Late/Early Leave),
  
  // Location with GeoJSON
  location: {
    type: String (enum: Office/Remote/Field),
    name: String (required),
    coordinates: {
      type: String (Point),
      lngnlat: [Number, Number] (required)
    }
  },
  
  // Images
  punchInImage: String (URL),
  punchOutImage: String (URL),
  
  // Modification tracking
  isModified: Boolean,
  modifiedBy: ObjectId (ref: User),
  modificationReason: String,
  
  timestamps: true
}
```

### Salary Model (`src/lib/models/salary.js`)
```javascript
{
  employeeId: ObjectId (ref: User, required),
  month: Number (required),
  year: Number (required),
  
  // Salary Components
  basicSalary: Number (required),
  hra: Number,
  allowances: Number,
  overtime: Number,
  bonus: Number,
  
  // Deductions
  pf: Number,
  esi: Number,
  tax: Number,
  otherDeductions: Number,
  
  // Calculated Fields
  grossSalary: Number,
  netSalary: Number,
  
  // Payment Info
  paymentDate: Date,
  paymentStatus: String (enum: Pending/Paid/Failed),
  paymentMethod: String,
  
  timestamps: true
}
```

### Leave Request Model (`src/lib/models/leave-request.js`)
```javascript
{
  employeeId: ObjectId (ref: User, required),
  leaveType: String (enum: Annual/Sick/Personal/Maternity/Paternity),
  startDate: Date (required),
  endDate: Date (required),
  totalDays: Number,
  reason: String (required),
  
  // Approval Workflow
  status: String (enum: Pending/Approved/Rejected),
  approvedBy: ObjectId (ref: User),
  approvalDate: Date,
  rejectionReason: String,
  
  // Emergency Contact (for sick leave)
  emergencyContact: String,
  
  timestamps: true
}
```

### Project Model (`src/lib/models/project.js`)
```javascript
{
  name: String (required),
  description: String,
  startDate: Date (required),
  endDate: Date,
  status: String (enum: Planning/Active/On Hold/Completed/Cancelled),
  priority: String (enum: Low/Medium/High/Critical),
  
  // Team Assignment
  projectManager: ObjectId (ref: User),
  teamMembers: [ObjectId] (ref: User),
  
  // Progress Tracking
  progress: Number (0-100),
  milestones: [{
    name: String,
    dueDate: Date,
    status: String,
    completedDate: Date
  }],
  
  // Tasks
  tasks: [{
    title: String,
    description: String,
    assignedTo: ObjectId (ref: User),
    status: String,
    dueDate: Date,
    priority: String
  }],
  
  timestamps: true
}
```

## Component Architecture

### Reusable UI Components (`src/components/ui/`)
```
├── button.jsx
├── card.jsx
├── input.jsx
├── select.jsx
├── dialog.jsx
├── table.jsx
├── badge.jsx
├── avatar.jsx
├── tabs.jsx
├── alert.jsx
├── toast.jsx
└── cloudinary-upload.jsx
```

### Feature-Specific Components
```
├── auth/
│   ├── LoginForm.jsx
│   └── UserProfile.jsx
├── attendance/
│   ├── PunchDialog.jsx
│   ├── AttendanceTable.jsx
│   └── AttendanceHistory.jsx
├── salary/
│   ├── SalaryCard.jsx
│   ├── PaymentHistory.jsx
│   └── PayslipDownload.jsx
├── leaves/
│   ├── LeaveRequestForm.jsx
│   ├── LeaveHistory.jsx
│   └── LeaveBalance.jsx
└── projects/
    ├── ProjectCard.jsx
    ├── TaskList.jsx
    └── TeamMembers.jsx
```

## Hooks & Utilities

### Custom Hooks (`src/hooks/`)
```javascript
// usePermissions.js - Role-based access control
const { canView, canCreate, canUpdate, canDelete } = usePermissions('resource', 'module');

// useCloudinaryUpload.js - File upload management
const { upload, uploading, error, progress } = useCloudinaryUpload();

// useAttendance.js - Attendance management
const { punchIn, punchOut, getStatus, history } = useAttendance();

// useGeolocation.js - Location services
const { location, error, getCurrentPosition } = useGeolocation();
```

### Utility Functions (`src/lib/utils/`)
```javascript
// cloudinary.js - Image upload utilities
export const uploadAttendanceImage = async (file, employeeId, type);
export const uploadProfileImage = async (file, userId);

// date.js - Date formatting utilities
export const formatDate = (date, format);
export const getTimeAgo = (date);

// validation.js - Form validation
export const validateEmail = (email);
export const validatePhone = (phone);
```

## Future Enhancements

### Planned Features
1. **Push Notifications**
   - Leave approval notifications
   - Salary credit alerts
   - Project deadline reminders

2. **Offline Capabilities**
   - Offline attendance marking
   - Data synchronization
   - Cached content access

3. **Advanced Analytics**
   - Personal productivity metrics
   - Attendance patterns
   - Performance insights

4. **Integration Features**
   - Calendar synchronization
   - Email notifications
   - Third-party app integrations

### Mobile App Development
- **React Native implementation**
- **Native camera integration**
- **Background location tracking**
- **Biometric authentication**

## Development Guidelines

### Component Structure
```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── attendance/
│   │   ├── salary/
│   │   ├── leaves/
│   │   ├── projects/
│   │   └── settings/
│   └── login/
├── components/
│   ├── ui/ (reusable components)
│   ├── auth/
│   └── employee-specific/
├── hooks/
├── lib/
│   ├── models/
│   ├── utils/
│   └── auth/
└── types/
```

### State Management Patterns
- **Local state for UI interactions**
- **Custom hooks for data fetching**
- **Context for global state**
- **Server state with SWR/React Query (planned)**

### Testing Strategy
- **Unit tests for components**
- **Integration tests for API endpoints**
- **E2E tests for critical user flows**
- **Mobile device testing**

## Environment Configuration

### Required Environment Variables
```bash
# Database
MONGODB_URI=mongodb+srv://...

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (optional)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email
EMAIL_SERVER_PASSWORD=your-password
```

### Installation & Setup
```bash
# Clone repository
git clone <repository-url>
cd cqams

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

This documentation provides a comprehensive overview of the CQAMS Employee App UI, covering all major features, technical implementation details, database schemas, and development guidelines. The app is designed to provide employees with a seamless, secure, and efficient way to manage their work-related activities. 