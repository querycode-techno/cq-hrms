import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Attendance from '@/lib/models/attendance';
import User from '@/lib/models/user';

// GET /api/attendance - Get attendance records with filtering
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50;
    const employeeId = searchParams.get('employeeId');
    const date = searchParams.get('date');
    const month = searchParams.get('month');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Build query
    let query = {};

    // Filter by employee
    if (employeeId && employeeId !== 'all') {
      query.employeeId = employeeId;
    }

    // Filter by date
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    } else if (month) {
      const [year, monthNum] = month.split('-');
      const startDate = new Date(year, monthNum - 1, 1);
      const endDate = new Date(year, monthNum, 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Get attendance records with employee details
    let attendanceQuery = Attendance.find(query)
      .populate('employeeId', 'firstName lastName employeeId profileImage')
      .populate('createdBy', 'firstName lastName')
      .populate('modifiedBy', 'firstName lastName')
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    let attendanceRecords = await attendanceQuery;

    // Filter by employee name if search is provided
    if (search) {
      attendanceRecords = attendanceRecords.filter(record => {
        const employeeName = `${record.employeeId.firstName} ${record.employeeId.lastName}`.toLowerCase();
        return employeeName.includes(search.toLowerCase());
      });
    }

    // Get total count for pagination
    const totalRecords = await Attendance.countDocuments(query);

    // Format the response
    const formattedRecords = attendanceRecords.map(record => ({
      id: record._id,
      employee: {
        id: record.employeeId._id,
        name: `${record.employeeId.firstName} ${record.employeeId.lastName}`,
        employeeId: record.employeeId.employeeId,
        avatar: record.employeeId.profileImage || null
      },
      date: record.dateFormatted,
      checkIn: record.checkInFormatted,
      checkOut: record.checkOutFormatted,
      totalHours: record.totalHoursFormatted,
      status: record.status,
      location: record.location?.name || '-',
      locationType: record.location?.type || 'Office',
      punchInImage: record.punchInImage,
      punchOutImage: record.punchOutImage,
      isModified: record.isModified,
      modificationReason: record.modificationReason,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data: formattedRecords,
      pagination: {
        page,
        limit,
        total: totalRecords,
        pages: Math.ceil(totalRecords / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching attendance records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance records' },
      { status: 500 }
    );
  }
}

// POST /api/attendance - Create new attendance record
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      employeeId,
      date,
      checkIn,
      checkOut,
      status,
      location,
      punchInImage,
      punchOutImage,
      modificationReason
    } = body;

    // Validate required fields
    if (!employeeId || !date) {
      return NextResponse.json(
        { error: 'Employee ID and date are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify employee exists
    const employee = await User.findById(employeeId);
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // Check if attendance record already exists for this date
    const existingRecord = await Attendance.findOne({
      employeeId,
      date: new Date(date)
    });

    if (existingRecord) {
      return NextResponse.json(
        { error: 'Attendance record already exists for this date' },
        { status: 400 }
      );
    }

    // Create attendance record
    const attendanceData = {
      employeeId,
      date: new Date(date),
      status: status || 'Present',
      createdBy: session.user.id
    };

    // Add time fields if not absent
    if (status !== 'Absent') {
      if (checkIn) {
        const [hours, minutes] = checkIn.split(':');
        const checkInDate = new Date(date);
        checkInDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        attendanceData.checkIn = checkInDate;
      }

      if (checkOut) {
        const [hours, minutes] = checkOut.split(':');
        const checkOutDate = new Date(date);
        checkOutDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        attendanceData.checkOut = checkOutDate;
      }

      // Add location
      if (location) {
        attendanceData.location = {
          type: location.type || 'Office',
          name: location.name || 'Main Office',
          coordinates: {
            type: 'Point',
            lngnlat: location.coordinates || [0, 0]
          }
        };
      }
    }

    // Add images if provided
    if (punchInImage) attendanceData.punchInImage = punchInImage;
    if (punchOutImage) attendanceData.punchOutImage = punchOutImage;

    // Add modification tracking if this is a manual entry
    if (modificationReason) {
      attendanceData.isModified = true;
      attendanceData.modifiedBy = session.user.id;
      attendanceData.modificationReason = modificationReason;
    }

    const newAttendance = new Attendance(attendanceData);
    await newAttendance.save();

    // Populate the response
    await newAttendance.populate('employeeId', 'firstName lastName employeeId profileImage');

    const formattedRecord = {
      id: newAttendance._id,
      employee: {
        id: newAttendance.employeeId._id,
        name: `${newAttendance.employeeId.firstName} ${newAttendance.employeeId.lastName}`,
        employeeId: newAttendance.employeeId.employeeId,
        avatar: newAttendance.employeeId.profileImage || null
      },
      date: newAttendance.dateFormatted,
      checkIn: newAttendance.checkInFormatted,
      checkOut: newAttendance.checkOutFormatted,
      totalHours: newAttendance.totalHoursFormatted,
      status: newAttendance.status,
      location: newAttendance.location?.name || '-',
      locationType: newAttendance.location?.type || 'Office',
      isModified: newAttendance.isModified,
      modificationReason: newAttendance.modificationReason
    };

    return NextResponse.json({
      success: true,
      message: 'Attendance record created successfully',
      data: formattedRecord
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating attendance record:', error);
    return NextResponse.json(
      { error: 'Failed to create attendance record' },
      { status: 500 }
    );
  }
} 