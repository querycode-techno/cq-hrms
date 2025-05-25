import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Address from '@/lib/models/address';
import User from '@/lib/models/user';

// GET /api/admin/employees/[id]/addresses - Get all addresses for employee
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

    const addresses = await Address.find({ employeeId: params.id });

    return NextResponse.json({
      success: true,
      data: addresses
    });

  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch addresses' },
      { status: 500 }
    );
  }
}

// POST /api/admin/employees/[id]/addresses - Create new address
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      addressType,
      addressLine1,
      addressLine2,
      landmark,
      city,
      state,
      country,
      pinCode,
      coordinates,
      contactPerson
    } = body;

    // Validate required fields
    if (!addressType || !addressLine1 || !city || !state || !country || !pinCode) {
      return NextResponse.json(
        { error: 'Missing required fields: addressType, addressLine1, city, state, country, pinCode' },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify employee exists
    const employee = await User.findById(params.id);
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    const newAddress = new Address({
      employeeId: params.id,
      addressType,
      addressLine1,
      addressLine2,
      landmark,
      city,
      state,
      country,
      pinCode,
      coordinates,
      contactPerson,
      createdBy: session.user.id
    });

    await newAddress.save();

    return NextResponse.json({
      success: true,
      message: 'Address created successfully',
      data: newAddress
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating address:', error);
    return NextResponse.json(
      { error: 'Failed to create address' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/employees/[id]/addresses - Update all addresses (replace)
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { addresses } = body;

    if (!Array.isArray(addresses)) {
      return NextResponse.json(
        { error: 'Addresses must be an array' },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify employee exists
    const employee = await User.findById(params.id);
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // Delete existing addresses
    await Address.deleteMany({ employeeId: params.id });

    // Create new addresses
    let createdAddresses = [];
    if (addresses.length > 0) {
      const addressRecords = addresses.map(addr => ({
        ...addr,
        employeeId: params.id,
        createdBy: session.user.id,
        updatedBy: session.user.id
      }));
      createdAddresses = await Address.insertMany(addressRecords);
    }

    return NextResponse.json({
      success: true,
      message: 'Addresses updated successfully',
      data: createdAddresses
    });

  } catch (error) {
    console.error('Error updating addresses:', error);
    return NextResponse.json(
      { error: 'Failed to update addresses' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/employees/[id]/addresses - Delete all addresses
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

    const result = await Address.deleteMany({ employeeId: params.id });

    return NextResponse.json({
      success: true,
      message: `${result.deletedCount} addresses deleted successfully`,
      data: { deletedCount: result.deletedCount }
    });

  } catch (error) {
    console.error('Error deleting addresses:', error);
    return NextResponse.json(
      { error: 'Failed to delete addresses' },
      { status: 500 }
    );
  }
} 