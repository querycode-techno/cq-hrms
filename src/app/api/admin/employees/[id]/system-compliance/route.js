import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import SystemCompliance from '@/lib/models/system-compliance';
import User from '@/lib/models/user';

// GET /api/admin/employees/[id]/system-compliance - Get system compliance details
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

    const systemCompliance = await SystemCompliance.findOne({ employeeId: params.id })
      .populate('createdBy', 'firstName lastName');

    return NextResponse.json({
      success: true,
      data: systemCompliance
    });

  } catch (error) {
    console.error('Error fetching system compliance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch system compliance' },
      { status: 500 }
    );
  }
}

// POST /api/admin/employees/[id]/system-compliance - Create system compliance details
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      softwareAccess,
      accessCardRequired,
      biometricEnrollment,
      codeOfConductAccepted,
      hrPoliciesAccepted,
      leavePolicyAccepted,
      itSecurityPolicyAccepted,
      ndaAccepted,
      skills,
      medicalNeeds
    } = body;

    await connectDB();

    // Verify employee exists
    const employee = await User.findById(params.id);
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // Check if system compliance already exists
    const existingCompliance = await SystemCompliance.findOne({ employeeId: params.id });
    if (existingCompliance) {
      return NextResponse.json(
        { error: 'System compliance details already exist for this employee. Use PUT to update.' },
        { status: 400 }
      );
    }

    const newSystemCompliance = new SystemCompliance({
      employeeId: params.id,
      softwareAccess: softwareAccess || [],
      accessCardRequired: accessCardRequired || false,
      biometricEnrollment: biometricEnrollment || false,
      codeOfConductAccepted: codeOfConductAccepted || false,
      hrPoliciesAccepted: hrPoliciesAccepted || false,
      leavePolicyAccepted: leavePolicyAccepted || false,
      itSecurityPolicyAccepted: itSecurityPolicyAccepted || false,
      ndaAccepted: ndaAccepted || false,
      skills,
      medicalNeeds,
      createdBy: session.user.id
    });

    await newSystemCompliance.save();

    // Populate the createdBy field for response
    await newSystemCompliance.populate('createdBy', 'firstName lastName');

    return NextResponse.json({
      success: true,
      message: 'System compliance details created successfully',
      data: newSystemCompliance
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating system compliance:', error);
    return NextResponse.json(
      { error: 'Failed to create system compliance' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/employees/[id]/system-compliance - Update system compliance details
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      softwareAccess,
      accessCardRequired,
      biometricEnrollment,
      codeOfConductAccepted,
      hrPoliciesAccepted,
      leavePolicyAccepted,
      itSecurityPolicyAccepted,
      ndaAccepted,
      skills,
      medicalNeeds
    } = body;

    await connectDB();

    // Verify employee exists
    const employee = await User.findById(params.id);
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    const existingCompliance = await SystemCompliance.findOne({ employeeId: params.id });

    let updatedCompliance;
    if (existingCompliance) {
      // Update existing compliance
      const updateData = {};
      if (softwareAccess !== undefined) updateData.softwareAccess = softwareAccess;
      if (accessCardRequired !== undefined) updateData.accessCardRequired = accessCardRequired;
      if (biometricEnrollment !== undefined) updateData.biometricEnrollment = biometricEnrollment;
      if (codeOfConductAccepted !== undefined) updateData.codeOfConductAccepted = codeOfConductAccepted;
      if (hrPoliciesAccepted !== undefined) updateData.hrPoliciesAccepted = hrPoliciesAccepted;
      if (leavePolicyAccepted !== undefined) updateData.leavePolicyAccepted = leavePolicyAccepted;
      if (itSecurityPolicyAccepted !== undefined) updateData.itSecurityPolicyAccepted = itSecurityPolicyAccepted;
      if (ndaAccepted !== undefined) updateData.ndaAccepted = ndaAccepted;
      if (skills !== undefined) updateData.skills = skills;
      if (medicalNeeds !== undefined) updateData.medicalNeeds = medicalNeeds;

      updatedCompliance = await SystemCompliance.findByIdAndUpdate(
        existingCompliance._id,
        updateData,
        { new: true, runValidators: true }
      ).populate('createdBy', 'firstName lastName');
    } else {
      // Create new compliance
      const newCompliance = new SystemCompliance({
        employeeId: params.id,
        softwareAccess: softwareAccess || [],
        accessCardRequired: accessCardRequired || false,
        biometricEnrollment: biometricEnrollment || false,
        codeOfConductAccepted: codeOfConductAccepted || false,
        hrPoliciesAccepted: hrPoliciesAccepted || false,
        leavePolicyAccepted: leavePolicyAccepted || false,
        itSecurityPolicyAccepted: itSecurityPolicyAccepted || false,
        ndaAccepted: ndaAccepted || false,
        skills,
        medicalNeeds,
        createdBy: session.user.id
      });
      updatedCompliance = await newCompliance.save();
      await updatedCompliance.populate('createdBy', 'firstName lastName');
    }

    return NextResponse.json({
      success: true,
      message: 'System compliance details updated successfully',
      data: updatedCompliance
    });

  } catch (error) {
    console.error('Error updating system compliance:', error);
    return NextResponse.json(
      { error: 'Failed to update system compliance' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/employees/[id]/system-compliance - Delete system compliance details
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

    const result = await SystemCompliance.deleteOne({ employeeId: params.id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'No system compliance details found for this employee' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'System compliance details deleted successfully',
      data: { deletedCount: result.deletedCount }
    });

  } catch (error) {
    console.error('Error deleting system compliance:', error);
    return NextResponse.json(
      { error: 'Failed to delete system compliance' },
      { status: 500 }
    );
  }
} 