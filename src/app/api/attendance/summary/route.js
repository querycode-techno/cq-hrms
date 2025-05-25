import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Attendance from '@/lib/models/attendance';
import User from '@/lib/models/user';

// GET /api/attendance/summary - Get attendance summary statistics
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    // Get today's date range
    const today = new Date(date);
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get this week's date range
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    // Get total active employees
    const totalEmployees = await User.countDocuments({ status: 'Active' });

    // Get today's attendance summary
    const todaysSummary = await Attendance.aggregate([
      {
        $match: {
          date: {
            $gte: today,
            $lt: tomorrow
          }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Format today's summary
    const summaryMap = {
      Present: 0,
      Absent: 0,
      Late: 0,
      'Early Leave': 0
    };

    todaysSummary.forEach(item => {
      summaryMap[item._id] = item.count;
    });

    // Calculate attendance percentage
    const totalPresent = summaryMap.Present + summaryMap.Late + summaryMap['Early Leave'];
    const attendancePercentage = totalEmployees > 0 ? Math.round((totalPresent / totalEmployees) * 100) : 0;

    // Get late arrivals (after 9:00 AM)
    const lateArrivals = await Attendance.countDocuments({
      date: { $gte: today, $lt: tomorrow },
      status: 'Late'
    });

    // Get this week's average hours
    const weeklyHours = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: startOfWeek, $lt: endOfWeek },
          status: { $in: ['Present', 'Late', 'Early Leave'] }
        }
      },
      {
        $group: {
          _id: null,
          avgHours: { $avg: '$totalHours' },
          totalRecords: { $sum: 1 }
        }
      }
    ]);

    const averageHours = weeklyHours.length > 0 ? weeklyHours[0].avgHours / 60 : 0; // Convert minutes to hours

    // Get monthly attendance trend (last 30 days)
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const monthlyTrend = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: thirtyDaysAgo, $lt: tomorrow }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }
          },
          present: {
            $sum: {
              $cond: [{ $in: ['$status', ['Present', 'Late', 'Early Leave']] }, 1, 0]
            }
          },
          absent: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Absent'] }, 1, 0]
            }
          },
          total: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]);

    // Get top performers (highest attendance this month)
    const topPerformers = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: thirtyDaysAgo, $lt: tomorrow }
        }
      },
      {
        $group: {
          _id: '$employeeId',
          totalDays: { $sum: 1 },
          presentDays: {
            $sum: {
              $cond: [{ $in: ['$status', ['Present', 'Late', 'Early Leave']] }, 1, 0]
            }
          },
          avgHours: { $avg: '$totalHours' }
        }
      },
      {
        $addFields: {
          attendanceRate: {
            $multiply: [{ $divide: ['$presentDays', '$totalDays'] }, 100]
          }
        }
      },
      {
        $sort: { attendanceRate: -1, avgHours: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'employee'
        }
      },
      {
        $unwind: '$employee'
      }
    ]);

    // Format top performers
    const formattedTopPerformers = topPerformers.map(performer => ({
      employee: {
        id: performer.employee._id,
        name: `${performer.employee.firstName} ${performer.employee.lastName}`,
        employeeId: performer.employee.employeeId,
        avatar: performer.employee.profileImage || null
      },
      attendanceRate: Math.round(performer.attendanceRate),
      avgHours: Math.round((performer.avgHours / 60) * 10) / 10, // Convert to hours with 1 decimal
      totalDays: performer.totalDays,
      presentDays: performer.presentDays
    }));

    // Get department-wise attendance
    const departmentAttendance = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: today, $lt: tomorrow }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'employee'
        }
      },
      {
        $unwind: '$employee'
      },
      {
        $group: {
          _id: '$employee.department',
          total: { $sum: 1 },
          present: {
            $sum: {
              $cond: [{ $in: ['$status', ['Present', 'Late', 'Early Leave']] }, 1, 0]
            }
          }
        }
      },
      {
        $addFields: {
          attendanceRate: {
            $multiply: [{ $divide: ['$present', '$total'] }, 100]
          }
        }
      },
      {
        $sort: { attendanceRate: -1 }
      }
    ]);

    return NextResponse.json({
      success: true,
      data: {
        date: date,
        totalEmployees,
        todaysSummary: {
          present: summaryMap.Present,
          absent: summaryMap.Absent,
          late: summaryMap.Late,
          earlyLeave: summaryMap['Early Leave'],
          attendancePercentage
        },
        lateArrivals,
        averageHours: Math.round(averageHours * 10) / 10, // Round to 1 decimal
        monthlyTrend,
        topPerformers: formattedTopPerformers,
        departmentAttendance
      }
    });

  } catch (error) {
    console.error('Error fetching attendance summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance summary' },
      { status: 500 }
    );
  }
} 