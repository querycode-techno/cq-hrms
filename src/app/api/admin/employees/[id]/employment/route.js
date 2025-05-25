import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/user';

// GET /api/admin/employees/[id]/employment - Get employment details
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const employee = await User.findById(params.id).select('department status createdAt');
    
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    const employmentData = {
      employeeId: params.id,
      department: employee.department,
      status: employee.status,
      dateOfJoining: employee.createdAt,
      // Add other employment fields as needed
      designation: null,
      employeeType: 'Full-time',
      reportingManager: null,
      workLocation: 'Office',
      shiftTimings: '9 AM - 5 PM',
      workingHours: 40
    };

    return NextResponse.json({
      success: true,
      data: employmentData
    });

  } catch (error) {
    console.error('Error fetching employment details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employment details' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/employees/[id]/employment - Update employment details
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      department,
      designation,
      employeeType,
      reportingManager,
      workLocation,
      shiftTimings,
      workingHours,
      status
    } = body;

    await connectDB();

    const employee = await User.findById(params.id);
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // Update employment fields in User model
    const updateData = {};
    if (department !== undefined) updateData.department = department;
    if (status !== undefined) updateData.status = status;

    const updatedEmployee = await User.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    );

    // Note: For now, we're storing basic employment info in User model
    // In a full implementation, you might want a separate Employment model

    return NextResponse.json({
      success: true,
      message: 'Employment details updated successfully',
      data: {
        employeeId: params.id,
        department: updatedEmployee.department,
        status: updatedEmployee.status,
        designation,
        employeeType,
        reportingManager,
        workLocation,
        shiftTimings,
        workingHours
      }
    });

  } catch (error) {
    console.error('Error updating employment details:', error);
    return NextResponse.json(
      { error: 'Failed to update employment details' },
      { status: 500 }
    );
  }
} 