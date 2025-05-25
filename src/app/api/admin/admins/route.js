// src/app/api/admin/admins/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/user';
import Role from '@/lib/models/role';
import bcrypt from 'bcryptjs';

// GET /api/admin/admins - List all admin users
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to view admin users
    const userPermissions = session.user.role?.permissions || [];
    const canViewAdmins = session.user.role?.name === 'Super Admin' || 
      userPermissions.some(p => p.module === 'admin' && (p.action === 'view' || p.action === 'all'));

    if (!canViewAdmins) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    await connectDB();

    // Get admin roles (roles that have admin-level permissions)
    const adminRoles = await Role.find({
      $or: [
        { name: { $in: ['Super Admin', 'HR Manager', 'Manager'] } },
        { 'permissions.module': 'admin' }
      ]
    });

    const adminRoleIds = adminRoles.map(role => role._id);

    // Find users with admin roles
    const admins = await User.find({
      role: { $in: adminRoleIds }
    })
    .populate({
      path: 'role',
      populate: {
        path: 'permissions',
        model: 'Permission'
      }
    })
    .select('-password')
    .sort({ createdAt: -1 });

    const formattedAdmins = admins.map(admin => ({
      id: admin._id,
      name: admin.fullName,
      email: admin.personalEmail,
      employeeId: admin.employeeId,
      role: {
        id: admin.role._id,
        name: admin.role.name,
        permissions: admin.role.permissions?.map(p => ({
          id: p._id,
          module: p.module,
          action: p.action,
          resource: p.resource
        })) || []
      },
      department: admin.department || 'Not Set',
      status: admin.status,
      lastLogin: admin.lastLogin || null,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data: formattedAdmins,
      total: formattedAdmins.length
    });

  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin users' },
      { status: 500 }
    );
  }
}

// POST /api/admin/admins - Create new admin user
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to create admin users
    const userPermissions = session.user.role?.permissions || [];
    const canCreateAdmins = session.user.role?.name === 'Super Admin' || 
      userPermissions.some(p => p.module === 'admin' && (p.action === 'create' || p.action === 'all'));

    if (!canCreateAdmins) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { firstName, lastName, email, roleId, department, password } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !roleId || !password) {
      return NextResponse.json(
        { error: 'Missing required fields: firstName, lastName, email, roleId, password' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ personalEmail: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Verify role exists and is valid for admin
    const role = await Role.findById(roleId);
    if (!role) {
      return NextResponse.json(
        { error: 'Invalid role specified' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new admin user
    const newAdmin = new User({
      firstName,
      lastName,
      personalEmail: email.toLowerCase(),
      password: hashedPassword,
      role: roleId,
      department: department || 'Administration',
      status: 'Active',
      dateOfBirth: new Date('1990-01-01'), // Default date, should be updated later
      gender: 'Prefer not to say', // Default value
      primaryContact: '0000000000', // Default value, should be updated later
      createdBy: session.user.id
    });

    await newAdmin.save();

    // Populate the role for response
    await newAdmin.populate({
      path: 'role',
      populate: {
        path: 'permissions',
        model: 'Permission'
      }
    });

    const responseData = {
      id: newAdmin._id,
      name: newAdmin.fullName,
      email: newAdmin.personalEmail,
      employeeId: newAdmin.employeeId,
      role: {
        id: newAdmin.role._id,
        name: newAdmin.role.name,
        permissions: newAdmin.role.permissions?.map(p => ({
          id: p._id,
          module: p.module,
          action: p.action,
          resource: p.resource
        })) || []
      },
      department: newAdmin.department,
      status: newAdmin.status,
      createdAt: newAdmin.createdAt
    };

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      data: responseData
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 }
    );
  }
}
