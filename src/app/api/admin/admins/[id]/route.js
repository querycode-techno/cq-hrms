// src/app/api/admin/admins/[id]/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/user';
import Role from '@/lib/models/role';
import bcrypt from 'bcryptjs';

// GET /api/admin/admins/[id] - Get specific admin user
export async function GET(request, { params }) {
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

    const admin = await User.findById(params.id)
      .populate({
        path: 'role',
        populate: {
          path: 'permissions',
          model: 'Permission'
        }
      })
      .select('-password');

    if (!admin) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    }

    const responseData = {
      id: admin._id,
      name: admin.fullName,
      firstName: admin.firstName,
      lastName: admin.lastName,
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
      department: admin.department,
      status: admin.status,
      primaryContact: admin.primaryContact,
      dateOfBirth: admin.dateOfBirth,
      gender: admin.gender,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt
    };

    return NextResponse.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('Error fetching admin:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin user' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/admins/[id] - Update admin user
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to update admin users
    const userPermissions = session.user.role?.permissions || [];
    const canUpdateAdmins = session.user.role?.name === 'Super Admin' || 
      userPermissions.some(p => p.module === 'admin' && (p.action === 'update' || p.action === 'all'));

    if (!canUpdateAdmins) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { firstName, lastName, email, roleId, department, status, password } = body;

    await connectDB();

    // Check if admin exists
    const admin = await User.findById(params.id);
    if (!admin) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    }

    // Check if email is being changed and if it's already taken
    if (email && email.toLowerCase() !== admin.personalEmail) {
      const existingUser = await User.findOne({ 
        personalEmail: email.toLowerCase(),
        _id: { $ne: params.id }
      });
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already in use by another user' },
          { status: 400 }
        );
      }
    }

    // Verify role exists if roleId is provided
    if (roleId) {
      const role = await Role.findById(roleId);
      if (!role) {
        return NextResponse.json(
          { error: 'Invalid role specified' },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.personalEmail = email.toLowerCase();
    if (roleId) updateData.role = roleId;
    if (department) updateData.department = department;
    if (status) updateData.status = status;

    // Hash password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    // Update admin
    const updatedAdmin = await User.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate({
      path: 'role',
      populate: {
        path: 'permissions',
        model: 'Permission'
      }
    }).select('-password');

    const responseData = {
      id: updatedAdmin._id,
      name: updatedAdmin.fullName,
      email: updatedAdmin.personalEmail,
      employeeId: updatedAdmin.employeeId,
      role: {
        id: updatedAdmin.role._id,
        name: updatedAdmin.role.name,
        permissions: updatedAdmin.role.permissions?.map(p => ({
          id: p._id,
          module: p.module,
          action: p.action,
          resource: p.resource
        })) || []
      },
      department: updatedAdmin.department,
      status: updatedAdmin.status,
      updatedAt: updatedAdmin.updatedAt
    };

    return NextResponse.json({
      success: true,
      message: 'Admin user updated successfully',
      data: responseData
    });

  } catch (error) {
    console.error('Error updating admin:', error);
    return NextResponse.json(
      { error: 'Failed to update admin user' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/admins/[id] - Delete admin user
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to delete admin users
    const userPermissions = session.user.role?.permissions || [];
    const canDeleteAdmins = session.user.role?.name === 'Super Admin' || 
      userPermissions.some(p => p.module === 'admin' && (p.action === 'delete' || p.action === 'all'));

    if (!canDeleteAdmins) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    await connectDB();

    // Check if admin exists
    const admin = await User.findById(params.id);
    if (!admin) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    }

    // Prevent self-deletion
    if (admin._id.toString() === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Delete admin
    await User.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: 'Admin user deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting admin:', error);
    return NextResponse.json(
      { error: 'Failed to delete admin user' },
      { status: 500 }
    );
  }
}
