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

// GET /api/admin/employees - List all employees with full details
export async function GET(request) {
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

    // Get URL parameters for filtering
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const department = searchParams.get('department') || '';
    const status = searchParams.get('status') || '';
    const includeDetails = searchParams.get('includeDetails') === 'true';

    // Build query
    const query = {};
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { personalEmail: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (department) {
      query.department = department;
    }
    
    if (status) {
      query.status = status;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get employees with role information
    let employeesQuery = User.find(query)
      .populate('role', 'name')
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const employees = await employeesQuery;

    // If detailed information is requested, fetch related data
    let employeesWithDetails = employees;
    if (includeDetails) {
      employeesWithDetails = await Promise.all(
        employees.map(async (employee) => {
          const [addresses, bankAccounts, compensation, documents, systemCompliance] = await Promise.all([
            Address.find({ employeeId: employee._id }),
            BankAccount.find({ employeeId: employee._id }),
            Compensation.findOne({ employeeId: employee._id }),
            Document.find({ employeeId: employee._id }),
            SystemCompliance.findOne({ employeeId: employee._id })
          ]);

          return {
            ...employee.toObject(),
            addresses,
            bankAccounts,
            compensation,
            documents,
            systemCompliance
          };
        })
      );
    }

    // Get total count for pagination
    const total = await User.countDocuments(query);

    const formattedEmployees = employeesWithDetails.map(employee => ({
      id: employee._id,
      name: employee.fullName,
      firstName: employee.firstName,
      middleName: employee.middleName,
      lastName: employee.lastName,
      email: employee.personalEmail,
      employeeId: employee.employeeId,
      department: employee.department || 'Not Set',
      role: employee.role?.name || 'No Role',
      status: employee.status,
      joinDate: employee.createdAt,
      profileImage: employee.profileImage,
      primaryContact: employee.primaryContact,
      dateOfBirth: employee.dateOfBirth,
      gender: employee.gender,
      bloodGroup: employee.bloodGroup,
      ...(includeDetails && {
        addresses: employee.addresses,
        bankAccounts: employee.bankAccounts,
        compensation: employee.compensation,
        documents: employee.documents,
        systemCompliance: employee.systemCompliance
      })
    }));

    return NextResponse.json({
      success: true,
      data: formattedEmployees,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}

// POST /api/admin/employees - Create new employee with full onboarding data
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to create employees
    const userPermissions = session.user.role?.permissions || [];
    const canCreateEmployees = session.user.role?.name === 'Super Admin' || 
      userPermissions.some(p => p.module === 'users' && (p.action === 'create' || p.action === 'all'));

    if (!canCreateEmployees) {
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
      password,
      
      // Employment Details
      designation,
      employeeType,
      reportingManager,
      workLocation,
      shiftTimings,
      workingHours,
      
      // Compensation Details
      ctc,
      basicSalary,
      hra,
      paymentCycle,
      panNumber,
      
      // Bank Account Details
      bankAccount,
      
      // Address Details
      addresses,
      
      // System Compliance
      systemCompliance,
      
      // Documents
      documents
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !personalEmail || !primaryContact || !dateOfBirth || !gender || !roleId) {
      return NextResponse.json(
        { error: 'Missing required fields: firstName, lastName, personalEmail, primaryContact, dateOfBirth, gender, roleId' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ personalEmail: personalEmail.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Verify role exists
    const role = await Role.findById(roleId);
    if (!role) {
      return NextResponse.json(
        { error: 'Invalid role specified' },
        { status: 400 }
      );
    }

    // Hash password if provided, otherwise generate a temporary one
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 12);
    } else {
      // Generate temporary password
      const tempPassword = Math.random().toString(36).slice(-8);
      hashedPassword = await bcrypt.hash(tempPassword, 12);
    }

    // Create new employee
    const newEmployee = new User({
      firstName,
      middleName: middleName || '',
      lastName,
      personalEmail: personalEmail.toLowerCase(),
      primaryContact,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      bloodGroup: bloodGroup || undefined,
      role: roleId,
      department: department || 'Not Set',
      password: hashedPassword,
      status: 'Active',
      createdBy: session.user.id
    });

    await newEmployee.save();

    // Create related records
    const createdRecords = {};

    // Create addresses if provided
    if (addresses && addresses.length > 0) {
      const addressRecords = addresses.map(addr => ({
        ...addr,
        employeeId: newEmployee._id,
        createdBy: session.user.id
      }));
      createdRecords.addresses = await Address.insertMany(addressRecords);
    }

    // Create bank account if provided
    if (bankAccount) {
      const bankAccountRecord = new BankAccount({
        ...bankAccount,
        employeeId: newEmployee._id,
        createdBy: session.user.id
      });
      createdRecords.bankAccount = await bankAccountRecord.save();
    }

    // Create compensation if provided
    if (ctc || basicSalary || hra) {
      const compensationRecord = new Compensation({
        employeeId: newEmployee._id,
        ctc,
        basicSalary,
        hra,
        paymentCycle: paymentCycle || 'Monthly',
        panNumber,
        createdBy: session.user.id
      });
      createdRecords.compensation = await compensationRecord.save();
    }

    // Create system compliance if provided
    if (systemCompliance) {
      const systemComplianceRecord = new SystemCompliance({
        ...systemCompliance,
        employeeId: newEmployee._id,
        createdBy: session.user.id
      });
      createdRecords.systemCompliance = await systemComplianceRecord.save();
    }

    // Create documents if provided
    if (documents && documents.length > 0) {
      const documentRecords = documents.map(doc => ({
        ...doc,
        employeeId: newEmployee._id,
        uploadedBy: session.user.id
      }));
      createdRecords.documents = await Document.insertMany(documentRecords);
    }

    // Populate the role for response
    await newEmployee.populate('role', 'name');

    const responseData = {
      id: newEmployee._id,
      name: newEmployee.fullName,
      firstName: newEmployee.firstName,
      lastName: newEmployee.lastName,
      email: newEmployee.personalEmail,
      employeeId: newEmployee.employeeId,
      department: newEmployee.department,
      role: newEmployee.role?.name || 'No Role',
      status: newEmployee.status,
      joinDate: newEmployee.createdAt,
      primaryContact: newEmployee.primaryContact,
      dateOfBirth: newEmployee.dateOfBirth,
      gender: newEmployee.gender,
      createdRecords
    };

    return NextResponse.json({
      success: true,
      message: 'Employee created successfully with all details',
      data: responseData
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    );
  }
} 