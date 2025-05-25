import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Permission from '@/lib/models/permission';

// GET /api/permissions - List all permissions grouped by module
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to view permissions
    const userPermissions = session.user.role?.permissions || [];
    const canViewPermissions = session.user.role?.name === 'Super Admin' || 
      userPermissions.some(p => p.module === 'roles' && (p.action === 'view' || p.action === 'all'));

    if (!canViewPermissions) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    await connectDB();

    // Get all permissions
    const permissions = await Permission.find().sort({ module: 1, resource: 1, action: 1 });

    // Group permissions by module
    const groupedPermissions = permissions.reduce((acc, permission) => {
      const module = permission.module;
      
      if (!acc[module]) {
        acc[module] = {
          module,
          permissions: []
        };
      }
      
      acc[module].permissions.push({
        id: permission._id,
        key: `${permission.resource}.${permission.action}`,
        name: `${permission.action.charAt(0).toUpperCase() + permission.action.slice(1)} ${permission.resource}`,
        action: permission.action,
        resource: permission.resource,
        module: permission.module
      });
      
      return acc;
    }, {});

    // Convert to array format
    const formattedPermissions = Object.values(groupedPermissions);

    return NextResponse.json({
      success: true,
      data: formattedPermissions,
      total: permissions.length
    });

  } catch (error) {
    console.error('Error fetching permissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch permissions' },
      { status: 500 }
    );
  }
} 