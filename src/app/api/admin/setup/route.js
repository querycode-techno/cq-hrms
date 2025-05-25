// src/app/api/admin/setup/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/user';
import Role from '@/lib/models/role';
import Permission from '@/lib/models/permission';
import bcrypt from 'bcryptjs';

// Default permissions for the system
const defaultPermissions = [
  // User Management
  { module: 'users', action: 'view', resource: 'employees' },
  { module: 'users', action: 'create', resource: 'employees' },
  { module: 'users', action: 'update', resource: 'employees' },
  { module: 'users', action: 'delete', resource: 'employees' },
  
  // Attendance Management
  { module: 'attendance', action: 'view', resource: 'records' },
  { module: 'attendance', action: 'create', resource: 'records' },
  { module: 'attendance', action: 'update', resource: 'records' },
  { module: 'attendance', action: 'delete', resource: 'records' },
  
  // Salary Management
  { module: 'salary', action: 'view', resource: 'payroll' },
  { module: 'salary', action: 'create', resource: 'payroll' },
  { module: 'salary', action: 'update', resource: 'payroll' },
  { module: 'salary', action: 'delete', resource: 'payroll' },
  
  // Project Management
  { module: 'projects', action: 'view', resource: 'projects' },
  { module: 'projects', action: 'create', resource: 'projects' },
  { module: 'projects', action: 'update', resource: 'projects' },
  { module: 'projects', action: 'delete', resource: 'projects' },
  
  // Leave Management
  { module: 'leaves', action: 'view', resource: 'requests' },
  { module: 'leaves', action: 'create', resource: 'requests' },
  { module: 'leaves', action: 'update', resource: 'requests' },
  { module: 'leaves', action: 'delete', resource: 'requests' },
  { module: 'leaves', action: 'update', resource: 'approval' },
  
  // Role Management
  { module: 'roles', action: 'view', resource: 'roles' },
  { module: 'roles', action: 'create', resource: 'roles' },
  { module: 'roles', action: 'update', resource: 'roles' },
  { module: 'roles', action: 'delete', resource: 'roles' },
  
  // Settings Management
  { module: 'settings', action: 'view', resource: 'system' },
  { module: 'settings', action: 'update', resource: 'system' },
  { module: 'settings', action: 'view', resource: 'company' },
  { module: 'settings', action: 'update', resource: 'company' },
  
  // Dashboard Access
  { module: 'dashboard', action: 'view', resource: 'analytics' },
  { module: 'dashboard', action: 'view', resource: 'reports' },
  
  // Document Management
  { module: 'documents', action: 'view', resource: 'files' },
  { module: 'documents', action: 'create', resource: 'files' },
  { module: 'documents', action: 'update', resource: 'files' },
  { module: 'documents', action: 'delete', resource: 'files' },
  
  // Super Admin - All Access
  { module: 'system', action: 'all', resource: '*' }
];

// Default roles
const defaultRoles = [
  {
    name: 'Super Admin',
    description: 'Full system access with all permissions',
    isSystemRole: true,
    permissions: ['system.*']
  },
  {
    name: 'HR Manager',
    description: 'Human Resources management access',
    isSystemRole: true,
    permissions: ['users.*', 'leaves.*', 'documents.*', 'dashboard.analytics']
  },
  {
    name: 'Employee',
    description: 'Basic employee access',
    isSystemRole: true,
    permissions: ['attendance.records', 'leaves.requests', 'documents.files']
  },
  {
    name: 'Manager',
    description: 'Team management access',
    isSystemRole: true,
    permissions: ['users.view', 'attendance.*', 'projects.*', 'leaves.approval']
  }
];

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { 
      adminEmail = 'admin@cqams.com',
      adminPassword = 'Admin@123',
      adminFirstName = 'Super',
      adminLastName = 'Admin',
      force = false 
    } = body;

    // Check if setup has already been done
    const existingAdmin = await User.findOne({ personalEmail: adminEmail });
    if (existingAdmin && !force) {
      return NextResponse.json({
        success: false,
        message: 'Setup already completed. Super admin user already exists.',
        data: { adminEmail }
      }, { status: 400 });
    }

    const setupResults = {
      permissions: { created: 0, existing: 0 },
      roles: { created: 0, existing: 0 },
      superAdmin: null
    };

    // 1. Create Permissions
    console.log('🔧 Creating permissions...');
    for (const permData of defaultPermissions) {
      try {
        const existingPermission = await Permission.findOne({
          module: permData.module,
          action: permData.action,
          resource: permData.resource
        });

        if (!existingPermission) {
          await Permission.create(permData);
          setupResults.permissions.created++;
          console.log(`✅ Created permission: ${permData.module}.${permData.action}.${permData.resource}`);
        } else {
          setupResults.permissions.existing++;
          console.log(`⚠️ Permission already exists: ${permData.module}.${permData.action}.${permData.resource}`);
        }
      } catch (error) {
        console.error(`❌ Error creating permission ${permData.module}.${permData.action}.${permData.resource}:`, error.message);
      }
    }

    // 2. Create Roles with Permissions
    console.log('🔧 Creating roles...');
    for (const roleData of defaultRoles) {
      try {
        let existingRole = await Role.findOne({ name: roleData.name });

        if (!existingRole) {
          // Get permission IDs for this role
          const rolePermissions = [];
          
          if (roleData.name === 'Super Admin') {
            // Super admin gets all permissions
            const allPermissions = await Permission.find({});
            rolePermissions.push(...allPermissions.map(p => p._id));
          } else {
            // Other roles get specific permissions based on patterns
            for (const permPattern of roleData.permissions) {
              if (permPattern.includes('*')) {
                const [module, action] = permPattern.split('.');
                const query = { module };
                if (action !== '*') query.action = action;
                
                const permissions = await Permission.find(query);
                rolePermissions.push(...permissions.map(p => p._id));
              } else {
                const [module, action, resource] = permPattern.split('.');
                const permission = await Permission.findOne({ module, action, resource });
                if (permission) rolePermissions.push(permission._id);
              }
            }
          }

          existingRole = await Role.create({
            name: roleData.name,
            description: roleData.description,
            isSystemRole: roleData.isSystemRole,
            permissions: [...new Set(rolePermissions)] // Remove duplicates
          });

          setupResults.roles.created++;
          console.log(`✅ Created role: ${roleData.name} with ${rolePermissions.length} permissions`);
        } else {
          setupResults.roles.existing++;
          console.log(`⚠️ Role already exists: ${roleData.name}`);
        }
      } catch (error) {
        console.error(`❌ Error creating role ${roleData.name}:`, error.message);
      }
    }

    // 3. Create Super Admin User
    console.log('🔧 Creating super admin user...');
    const superAdminRole = await Role.findOne({ name: 'Super Admin' });
    
    if (!superAdminRole) {
      throw new Error('Super Admin role not found');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    let superAdmin;
    if (existingAdmin && force) {
      // Update existing admin
      superAdmin = await User.findByIdAndUpdate(existingAdmin._id, {
        firstName: adminFirstName,
        lastName: adminLastName,
        password: hashedPassword,
        role: superAdminRole._id,
        status: 'Active'
      }, { new: true });
      console.log(`✅ Updated existing super admin: ${adminEmail}`);
    } else {
      // Create new admin
      superAdmin = await User.create({
        firstName: adminFirstName,
        lastName: adminLastName,
        personalEmail: adminEmail,
        password: hashedPassword,
        primaryContact: '+1234567890',
        dateOfBirth: new Date('1990-01-01'),
        gender: 'Prefer not to say',
        role: superAdminRole._id,
        status: 'Active',
        createdBy: null // Self-created
      });
      console.log(`✅ Created super admin: ${adminEmail}`);
    }

    setupResults.superAdmin = {
      id: superAdmin._id,
      email: superAdmin.personalEmail,
      fullName: superAdmin.fullName,
      employeeId: superAdmin.employeeId
    };

    return NextResponse.json({
      success: true,
      message: 'System setup completed successfully!',
      data: {
        setupResults,
        credentials: {
          email: adminEmail,
          password: adminPassword,
          note: 'Please change the password after first login'
        }
      }
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Setup failed:', error);
    return NextResponse.json({
      success: false,
      message: 'Setup failed',
      error: error.message
    }, { status: 500 });
  }
}

// GET method to check setup status
export async function GET() {
  try {
    await connectDB();
    
    const permissionCount = await Permission.countDocuments();
    const roleCount = await Role.countDocuments();
    const userCount = await User.countDocuments();
    const superAdminExists = await User.findOne({ 
      personalEmail: { $regex: /admin/i } 
    }).populate('role');

    return NextResponse.json({
      success: true,
      setupStatus: {
        isSetupComplete: permissionCount > 0 && roleCount > 0 && userCount > 0,
        permissions: permissionCount,
        roles: roleCount,
        users: userCount,
        superAdminExists: !!superAdminExists,
        superAdmin: superAdminExists ? {
          email: superAdminExists.personalEmail,
          role: superAdminExists.role?.name,
          employeeId: superAdminExists.employeeId
        } : null
      }
    });

  } catch (error) {
    console.error('❌ Setup status check failed:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to check setup status',
      error: error.message
    }, { status: 500 });
  }
}
