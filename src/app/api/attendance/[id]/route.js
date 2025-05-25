import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Attendance from '@/lib/models/attendance';

// GET /api/attendance/[id] - Get specific attendance record
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const attendance = await Attendance.findById(params.id)
      .populate('employeeId', 'firstName lastName employeeId profileImage')
      .populate('createdBy', 'firstName lastName')
      .populate('modifiedBy', 'firstName lastName');

    if (!attendance) {
      return NextResponse.json({ error: 'Attendance record not found' }, { status: 404 });
    }

    const formattedRecord = {
      id: attendance._id,
      employee: {
        id: attendance.employeeId._id,
        name: `${attendance.employeeId.firstName} ${attendance.employeeId.lastName}`,
        employeeId: attendance.employeeId.employeeId,
        avatar: attendance.employeeId.profileImage || null
      },
      date: attendance.dateFormatted,
      checkIn: attendance.checkInFormatted,
      checkOut: attendance.checkOutFormatted,
      totalHours: attendance.totalHoursFormatted,
      status: attendance.status,
      location: attendance.location?.name || '-',
      locationType: attendance.location?.type || 'Office',
      punchInImage: attendance.punchInImage,
      punchOutImage: attendance.punchOutImage,
      isModified: attendance.isModified,
      modificationReason: attendance.modificationReason,
      createdBy: attendance.createdBy ? {
        id: attendance.createdBy._id,
        name: `${attendance.createdBy.firstName} ${attendance.createdBy.lastName}`
      } : null,
      modifiedBy: attendance.modifiedBy ? {
        id: attendance.modifiedBy._id,
        name: `${attendance.modifiedBy.firstName} ${attendance.modifiedBy.lastName}`
      } : null,
      createdAt: attendance.createdAt,
      updatedAt: attendance.updatedAt
    };

    return NextResponse.json({
      success: true,
      data: formattedRecord
    });

  } catch (error) {
    console.error('Error fetching attendance record:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance record' },
      { status: 500 }
    );
  }
}

// PUT /api/attendance/[id] - Update attendance record
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      checkIn,
      checkOut,
      status,
      location,
      modificationReason
    } = body;

    await connectDB();

    const attendance = await Attendance.findById(params.id);
    if (!attendance) {
      return NextResponse.json({ error: 'Attendance record not found' }, { status: 404 });
    }

    // Update fields
    const updateData = {
      isModified: true,
      modifiedBy: session.user.id,
      modificationReason: modificationReason || 'Manual update'
    };

    if (status) updateData.status = status;

    // Update time fields if not absent
    if (status !== 'Absent') {
      if (checkIn) {
        const [hours, minutes] = checkIn.split(':');
        const checkInDate = new Date(attendance.date);
        checkInDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        updateData.checkIn = checkInDate;
      }

      if (checkOut) {
        const [hours, minutes] = checkOut.split(':');
        const checkOutDate = new Date(attendance.date);
        checkOutDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        updateData.checkOut = checkOutDate;
      }

      // Update location
      if (location) {
        updateData.location = {
          type: location.type || attendance.location?.type || 'Office',
          name: location.name || attendance.location?.name || 'Main Office',
          coordinates: {
            type: 'Point',
            lngnlat: location.coordinates || attendance.location?.coordinates?.lngnlat || [0, 0]
          }
        };
      }
    } else {
      // If status is Absent, clear time fields
      updateData.checkIn = null;
      updateData.checkOut = null;
      updateData.location = {
        type: 'Office',
        name: '-',
        coordinates: { type: 'Point', lngnlat: [0, 0] }
      };
    }

    const updatedAttendance = await Attendance.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('employeeId', 'firstName lastName employeeId profileImage');

    const formattedRecord = {
      id: updatedAttendance._id,
      employee: {
        id: updatedAttendance.employeeId._id,
        name: `${updatedAttendance.employeeId.firstName} ${updatedAttendance.employeeId.lastName}`,
        employeeId: updatedAttendance.employeeId.employeeId,
        avatar: updatedAttendance.employeeId.profileImage || null
      },
      date: updatedAttendance.dateFormatted,
      checkIn: updatedAttendance.checkInFormatted,
      checkOut: updatedAttendance.checkOutFormatted,
      totalHours: updatedAttendance.totalHoursFormatted,
      status: updatedAttendance.status,
      location: updatedAttendance.location?.name || '-',
      locationType: updatedAttendance.location?.type || 'Office',
      isModified: updatedAttendance.isModified,
      modificationReason: updatedAttendance.modificationReason
    };

    return NextResponse.json({
      success: true,
      message: 'Attendance record updated successfully',
      data: formattedRecord
    });

  } catch (error) {
    console.error('Error updating attendance record:', error);
    return NextResponse.json(
      { error: 'Failed to update attendance record' },
      { status: 500 }
    );
  }
}

// DELETE /api/attendance/[id] - Delete attendance record
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const attendance = await Attendance.findById(params.id);
    if (!attendance) {
      return NextResponse.json({ error: 'Attendance record not found' }, { status: 404 });
    }

    await Attendance.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: 'Attendance record deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting attendance record:', error);
    return NextResponse.json(
      { error: 'Failed to delete attendance record' },
      { status: 500 }
    );
  }
} 