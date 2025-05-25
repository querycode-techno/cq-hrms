import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Compensation from '@/lib/models/compensation';
import User from '@/lib/models/user';

// GET /api/admin/employees/[id]/compensation - Get compensation details
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Verify employee exists
    const employee = await User.findById(params.id);
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    const compensation = await Compensation.findOne({ employeeId: params.id });

    return NextResponse.json({
      success: true,
      data: compensation
    });

  } catch (error) {
    console.error('Error fetching compensation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch compensation' },
      { status: 500 }
    );
  }
}

// POST /api/admin/employees/[id]/compensation - Create compensation details
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      ctc,
      basicSalary,
      hra,
      paymentCycle,
      panNumber
    } = body;

    await connectDB();

    // Verify employee exists
    const employee = await User.findById(params.id);
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // Check if compensation already exists
    const existingCompensation = await Compensation.findOne({ employeeId: params.id });
    if (existingCompensation) {
      return NextResponse.json(
        { error: 'Compensation details already exist for this employee. Use PUT to update.' },
        { status: 400 }
      );
    }

    const newCompensation = new Compensation({
      employeeId: params.id,
      ctc,
      basicSalary,
      hra,
      paymentCycle: paymentCycle || 'Monthly',
      panNumber,
      createdBy: session.user.id
    });

    await newCompensation.save();

    return NextResponse.json({
      success: true,
      message: 'Compensation details created successfully',
      data: newCompensation
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating compensation:', error);
    return NextResponse.json(
      { error: 'Failed to create compensation' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/employees/[id]/compensation - Update compensation details
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      ctc,
      basicSalary,
      hra,
      paymentCycle,
      panNumber
    } = body;

    await connectDB();

    // Verify employee exists
    const employee = await User.findById(params.id);
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    const existingCompensation = await Compensation.findOne({ employeeId: params.id });

    let updatedCompensation;
    if (existingCompensation) {
      // Update existing compensation
      const updateData = {};
      if (ctc !== undefined) updateData.ctc = ctc;
      if (basicSalary !== undefined) updateData.basicSalary = basicSalary;
      if (hra !== undefined) updateData.hra = hra;
      if (paymentCycle !== undefined) updateData.paymentCycle = paymentCycle;
      if (panNumber !== undefined) updateData.panNumber = panNumber;
      updateData.updatedBy = session.user.id;

      updatedCompensation = await Compensation.findByIdAndUpdate(
        existingCompensation._id,
        updateData,
        { new: true, runValidators: true }
      );
    } else {
      // Create new compensation
      const newCompensation = new Compensation({
        employeeId: params.id,
        ctc,
        basicSalary,
        hra,
        paymentCycle: paymentCycle || 'Monthly',
        panNumber,
        createdBy: session.user.id
      });
      updatedCompensation = await newCompensation.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Compensation details updated successfully',
      data: updatedCompensation
    });

  } catch (error) {
    console.error('Error updating compensation:', error);
    return NextResponse.json(
      { error: 'Failed to update compensation' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/employees/[id]/compensation - Delete compensation details
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Verify employee exists
    const employee = await User.findById(params.id);
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    const result = await Compensation.deleteOne({ employeeId: params.id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'No compensation details found for this employee' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Compensation details deleted successfully',
      data: { deletedCount: result.deletedCount }
    });

  } catch (error) {
    console.error('Error deleting compensation:', error);
    return NextResponse.json(
      { error: 'Failed to delete compensation' },
      { status: 500 }
    );
  }
} 