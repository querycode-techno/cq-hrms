import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Role from '@/lib/models/role';
import Permission from '@/lib/models/permission';
import User from '@/lib/models/user';

// GET /api/roles - List all roles
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to view roles
    const userPermissions = session.user.role?.permissions || [];
    const canViewRoles = session.user.role?.name === 'Super Admin' || 
      userPermissions.some(p => p.module === 'roles' && (p.action === 'view' || p.action === 'all'));

    if (!canViewRoles) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    await connectDB();

    // Get all roles with permissions and user count
    const roles = await Role.find()
      .populate('permissions')
      .sort({ createdAt: -1 });

    // Get user count for each role
    const rolesWithUserCount = await Promise.all(
      roles.map(async (role) => {
        const userCount = await User.countDocuments({ role: role._id });
        
        return {
          id: role._id,
          name: role.name,
          description: role.description,
          isSystemRole: role.isSystemRole,
          userCount,
          permissions: role.permissions.map(p => ({
            id: p._id,
            module: p.module,
            action: p.action,
            resource: p.resource,
            name: `${p.resource}.${p.action}`
          })),
          createdAt: role.createdAt,
          updatedAt: role.updatedAt
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: rolesWithUserCount,
      total: rolesWithUserCount.length
    });

  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch roles' },
      { status: 500 }
    );
  }
}

// POST /api/roles - Create new role
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to create roles
    const userPermissions = session.user.role?.permissions || [];
    const canCreateRoles = session.user.role?.name === 'Super Admin' || 
      userPermissions.some(p => p.module === 'roles' && (p.action === 'create' || p.action === 'all'));

    if (!canCreateRoles) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, permissionIds } = body;

    // Validate required fields
    if (!name || !permissionIds || !Array.isArray(permissionIds)) {
      return NextResponse.json(
        { error: 'Missing required fields: name, permissionIds (array)' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if role name already exists
    const existingRole = await Role.findOne({ name: name.trim() });
    if (existingRole) {
      return NextResponse.json(
        { error: 'Role with this name already exists' },
        { status: 400 }
      );
    }

    // Verify all permission IDs exist
    const permissions = await Permission.find({ _id: { $in: permissionIds } });
    if (permissions.length !== permissionIds.length) {
      return NextResponse.json(
        { error: 'One or more invalid permission IDs' },
        { status: 400 }
      );
    }

    // Create new role
    const newRole = new Role({
      name: name.trim(),
      description: description?.trim() || '',
      permissions: permissionIds,
      isSystemRole: false
    });

    await newRole.save();

    // Populate permissions for response
    await newRole.populate('permissions');

    const responseData = {
      id: newRole._id,
      name: newRole.name,
      description: newRole.description,
      isSystemRole: newRole.isSystemRole,
      userCount: 0,
      permissions: newRole.permissions.map(p => ({
        id: p._id,
        module: p.module,
        action: p.action,
        resource: p.resource,
        name: `${p.resource}.${p.action}`
      })),
      createdAt: newRole.createdAt
    };

    return NextResponse.json({
      success: true,
      message: 'Role created successfully',
      data: responseData
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating role:', error);
    return NextResponse.json(
      { error: 'Failed to create role' },
      { status: 500 }
    );
  }
} 