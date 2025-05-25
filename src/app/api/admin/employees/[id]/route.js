import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/user';
import Role from '@/lib/models/role';
import Address from '@/lib/models/address';
import BankAccount from '@/lib/models/bank-account';
import Compensation from '@/lib/models/compensation';
import Document from '@/lib/models/document';
import SystemCompliance from '@/lib/models/system-compliance';
import bcrypt from 'bcryptjs';

// GET /api/admin/employees/[id] - Get single employee with all details
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to view employees
    const userPermissions = session.user.role?.permissions || [];
    const canViewEmployees = session.user.role?.name === 'Super Admin' || 
      userPermissions.some(p => p.module === 'users' && (p.action === 'view' || p.action === 'all'));

    if (!canViewEmployees) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    await connectDB();

    const employee = await User.findById(params.id)
      .populate('role', 'name')
      .select('-password');

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // Fetch all related data
    const [addresses, bankAccounts, compensation, documents, systemCompliance] = await Promise.all([
      Address.find({ employeeId: employee._id }),
      BankAccount.find({ employeeId: employee._id }),
      Compensation.findOne({ employeeId: employee._id }),
      Document.find({ employeeId: employee._id }),
      SystemCompliance.findOne({ employeeId: employee._id })
    ]);

    const responseData = {
      id: employee._id,
      firstName: employee.firstName,
      middleName: employee.middleName,
      lastName: employee.lastName,
      name: employee.fullName,
      email: employee.personalEmail,
      employeeId: employee.employeeId,
      department: employee.department,
      role: employee.role?.name || 'No Role',
      roleId: employee.role?._id,
      status: employee.status,
      joinDate: employee.createdAt,
      profileImage: employee.profileImage,
      primaryContact: employee.primaryContact,
      dateOfBirth: employee.dateOfBirth,
      gender: employee.gender,
      bloodGroup: employee.bloodGroup,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
      
      // Related data
      addresses: addresses || [],
      bankAccounts: bankAccounts || [],
      compensation: compensation || null,
      documents: documents || [],
      systemCompliance: systemCompliance || null
    };

    return NextResponse.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('Error fetching employee:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employee' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/employees/[id] - Update employee with all details
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to update employees
    const userPermissions = session.user.role?.permissions || [];
    const canUpdateEmployees = session.user.role?.name === 'Super Admin' || 
      userPermissions.some(p => p.module === 'users' && (p.action === 'update' || p.action === 'all'));

    if (!canUpdateEmployees) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { 
      // Personal Information
      firstName, 
      lastName, 
      middleName,
      personalEmail, 
      primaryContact, 
      dateOfBirth, 
      gender, 
      bloodGroup,
      roleId,
      department,
      status,
      password,
      
      // Employment Details
      designation,
      employeeType,
      reportingManager,
      workLocation,
      shiftTimings,
      workingHours,
      
      // Compensation Details
      compensation,
      
      // Bank Account Details
      bankAccounts,
      
      // Address Details
      addresses,
      
      // System Compliance
      systemCompliance,
      
      // Documents
      documents
    } = body;

    await connectDB();

    // Check if employee exists
    const employee = await User.findById(params.id);
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // Check if email is being changed and if it's already taken
    if (personalEmail && personalEmail.toLowerCase() !== employee.personalEmail) {
      const existingUser = await User.findOne({ 
        personalEmail: personalEmail.toLowerCase(),
        _id: { $ne: params.id }
      });
      if (existingUser) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        );
      }
    }

    // Verify role exists if roleId is provided
    if (roleId) {
      const role = await Role.findById(roleId);
      if (!role) {
        return NextResponse.json(
          { error: 'Invalid role specified' },
          { status: 400 }
        );
      }
    }

    // Prepare update data for user
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (middleName !== undefined) updateData.middleName = middleName;
    if (personalEmail) updateData.personalEmail = personalEmail.toLowerCase();
    if (primaryContact) updateData.primaryContact = primaryContact;
    if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth);
    if (gender) updateData.gender = gender;
    if (bloodGroup !== undefined) updateData.bloodGroup = bloodGroup;
    if (roleId) updateData.role = roleId;
    if (department !== undefined) updateData.department = department;
    if (status) updateData.status = status;

    // Hash password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    // Update employee
    const updatedEmployee = await User.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('role', 'name');

    // Update related records
    const updatedRecords = {};

    // Update addresses
    if (addresses) {
      // Delete existing addresses
      await Address.deleteMany({ employeeId: params.id });
      
      // Create new addresses
      if (addresses.length > 0) {
        const addressRecords = addresses.map(addr => ({
          ...addr,
          employeeId: params.id,
          createdBy: session.user.id,
          updatedBy: session.user.id
        }));
        updatedRecords.addresses = await Address.insertMany(addressRecords);
      }
    }

    // Update bank accounts
    if (bankAccounts) {
      // Delete existing bank accounts
      await BankAccount.deleteMany({ employeeId: params.id });
      
      // Create new bank accounts
      if (bankAccounts.length > 0) {
        const bankAccountRecords = bankAccounts.map(account => ({
          ...account,
          employeeId: params.id,
          createdBy: session.user.id,
          updatedBy: session.user.id
        }));
        updatedRecords.bankAccounts = await BankAccount.insertMany(bankAccountRecords);
      }
    }

    // Update compensation
    if (compensation) {
      const existingCompensation = await Compensation.findOne({ employeeId: params.id });
      
      if (existingCompensation) {
        updatedRecords.compensation = await Compensation.findByIdAndUpdate(
          existingCompensation._id,
          { ...compensation, updatedBy: session.user.id },
          { new: true, runValidators: true }
        );
      } else {
        const compensationRecord = new Compensation({
          ...compensation,
          employeeId: params.id,
          createdBy: session.user.id
        });
        updatedRecords.compensation = await compensationRecord.save();
      }
    }

    // Update system compliance
    if (systemCompliance) {
      const existingCompliance = await SystemCompliance.findOne({ employeeId: params.id });
      
      if (existingCompliance) {
        updatedRecords.systemCompliance = await SystemCompliance.findByIdAndUpdate(
          existingCompliance._id,
          { ...systemCompliance, updatedBy: session.user.id },
          { new: true, runValidators: true }
        );
      } else {
        const complianceRecord = new SystemCompliance({
          ...systemCompliance,
          employeeId: params.id,
          createdBy: session.user.id
        });
        updatedRecords.systemCompliance = await complianceRecord.save();
      }
    }

    // Update documents
    if (documents) {
      // Delete existing documents
      await Document.deleteMany({ employeeId: params.id });
      
      // Create new documents
      if (documents.length > 0) {
        const documentRecords = documents.map(doc => ({
          ...doc,
          employeeId: params.id,
          uploadedBy: session.user.id
        }));
        updatedRecords.documents = await Document.insertMany(documentRecords);
      }
    }

    const responseData = {
      id: updatedEmployee._id,
      firstName: updatedEmployee.firstName,
      middleName: updatedEmployee.middleName,
      lastName: updatedEmployee.lastName,
      name: updatedEmployee.fullName,
      email: updatedEmployee.personalEmail,
      employeeId: updatedEmployee.employeeId,
      department: updatedEmployee.department,
      role: updatedEmployee.role?.name || 'No Role',
      roleId: updatedEmployee.role?._id,
      status: updatedEmployee.status,
      joinDate: updatedEmployee.createdAt,
      profileImage: updatedEmployee.profileImage,
      primaryContact: updatedEmployee.primaryContact,
      dateOfBirth: updatedEmployee.dateOfBirth,
      gender: updatedEmployee.gender,
      bloodGroup: updatedEmployee.bloodGroup,
      updatedAt: updatedEmployee.updatedAt,
      updatedRecords
    };

    return NextResponse.json({
      success: true,
      message: 'Employee updated successfully with all details',
      data: responseData
    });

  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json(
      { error: 'Failed to update employee' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/employees/[id] - Delete employee and all related data
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to delete employees
    const userPermissions = session.user.role?.permissions || [];
    const canDeleteEmployees = session.user.role?.name === 'Super Admin' || 
      userPermissions.some(p => p.module === 'users' && (p.action === 'delete' || p.action === 'all'));

    if (!canDeleteEmployees) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    await connectDB();

    // Check if employee exists
    const employee = await User.findById(params.id);
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // Prevent self-deletion
    if (employee._id.toString() === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Instead of hard delete, we'll soft delete by setting status to 'Terminated'
    // and optionally delete related records based on business requirements
    const updatedEmployee = await User.findByIdAndUpdate(
      params.id,
      { status: 'Terminated' },
      { new: true }
    );

    // Optionally delete related records (uncomment if needed)
    /*
    await Promise.all([
      Address.deleteMany({ employeeId: params.id }),
      BankAccount.deleteMany({ employeeId: params.id }),
      Compensation.deleteOne({ employeeId: params.id }),
      Document.deleteMany({ employeeId: params.id }),
      SystemCompliance.deleteOne({ employeeId: params.id })
    ]);
    */

    return NextResponse.json({
      success: true,
      message: 'Employee deleted successfully',
      data: { id: updatedEmployee._id, status: updatedEmployee.status }
    });

  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json(
      { error: 'Failed to delete employee' },
      { status: 500 }
    );
  }
} 