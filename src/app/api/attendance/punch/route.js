import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Attendance from '@/lib/models/attendance';

// POST /api/attendance/punch - Handle punch in/out
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      action, // 'in' or 'out'
      image, // base64 image or file path
      location,
      coordinates
    } = body;

    if (!action || !['in', 'out'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "in" or "out"' },
        { status: 400 }
      );
    }

    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find today's attendance record for the user
    let attendanceRecord = await Attendance.findOne({
      employeeId: session.user.id,
      date: { $gte: today, $lt: tomorrow }
    });

    const currentTime = new Date();

    if (action === 'in') {
      // Punch In
      if (attendanceRecord) {
        return NextResponse.json(
          { error: 'You have already punched in today' },
          { status: 400 }
        );
      }

      // Determine status based on time (9:00 AM threshold)
      const nineAM = new Date(today);
      nineAM.setHours(9, 0, 0, 0);
      const status = currentTime > nineAM ? 'Late' : 'Present';

      // Create new attendance record
      const attendanceData = {
        employeeId: session.user.id,
        date: today,
        checkIn: currentTime,
        status,
        createdBy: session.user.id
      };

      // Add location data
      if (location || coordinates) {
        attendanceData.location = {
          type: location?.type || 'Office',
          name: location?.name || 'Main Office',
          coordinates: {
            type: 'Point',
            lngnlat: coordinates || [0, 0]
          }
        };
      }

      // Add punch in image
      if (image) {
        attendanceData.punchInImage = image;
      }

      attendanceRecord = new Attendance(attendanceData);
      await attendanceRecord.save();

      return NextResponse.json({
        success: true,
        message: `Punched in successfully at ${currentTime.toLocaleTimeString()}`,
        data: {
          action: 'in',
          time: currentTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }),
          status,
          location: attendanceData.location?.name || 'Office'
        }
      });

    } else {
      // Punch Out
      if (!attendanceRecord) {
        return NextResponse.json(
          { error: 'No punch in record found for today' },
          { status: 400 }
        );
      }

      if (attendanceRecord.checkOut) {
        return NextResponse.json(
          { error: 'You have already punched out today' },
          { status: 400 }
        );
      }

      // Update attendance record with punch out
      const updateData = {
        checkOut: currentTime
      };

      // Add punch out image
      if (image) {
        updateData.punchOutImage = image;
      }

      // Check if leaving early (before 5:00 PM)
      const fivePM = new Date(today);
      fivePM.setHours(17, 0, 0, 0);
      
      if (currentTime < fivePM && attendanceRecord.status === 'Present') {
        updateData.status = 'Early Leave';
      }

      await Attendance.findByIdAndUpdate(
        attendanceRecord._id,
        updateData,
        { new: true, runValidators: true }
      );

      // Calculate total hours worked
      const diffMs = currentTime - attendanceRecord.checkIn;
      const totalHours = Math.round(diffMs / (1000 * 60)); // in minutes
      const hoursWorked = Math.floor(totalHours / 60);
      const minutesWorked = totalHours % 60;

      return NextResponse.json({
        success: true,
        message: `Punched out successfully at ${currentTime.toLocaleTimeString()}`,
        data: {
          action: 'out',
          time: currentTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }),
          totalHours: `${hoursWorked}h ${minutesWorked}m`,
          status: updateData.status || attendanceRecord.status
        }
      });
    }

  } catch (error) {
    console.error('Error processing punch:', error);
    return NextResponse.json(
      { error: 'Failed to process punch request' },
      { status: 500 }
    );
  }
}

// GET /api/attendance/punch - Get current punch status
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find today's attendance record
    const attendanceRecord = await Attendance.findOne({
      employeeId: session.user.id,
      date: { $gte: today, $lt: tomorrow }
    });

    if (!attendanceRecord) {
      return NextResponse.json({
        success: true,
        data: {
          hasPunchedIn: false,
          hasPunchedOut: false,
          canPunchIn: true,
          canPunchOut: false,
          status: null,
          checkIn: null,
          checkOut: null
        }
      });
    }

    const hasPunchedIn = !!attendanceRecord.checkIn;
    const hasPunchedOut = !!attendanceRecord.checkOut;

    return NextResponse.json({
      success: true,
      data: {
        hasPunchedIn,
        hasPunchedOut,
        canPunchIn: !hasPunchedIn,
        canPunchOut: hasPunchedIn && !hasPunchedOut,
        status: attendanceRecord.status,
        checkIn: hasPunchedIn ? attendanceRecord.checkIn.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }) : null,
        checkOut: hasPunchedOut ? attendanceRecord.checkOut.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }) : null,
        location: attendanceRecord.location?.name || 'Office'
      }
    });

  } catch (error) {
    console.error('Error fetching punch status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch punch status' },
      { status: 500 }
    );
  }
} 