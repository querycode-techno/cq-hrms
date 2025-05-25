import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import BankAccount from '@/lib/models/bank-account';
import User from '@/lib/models/user';

// GET /api/admin/employees/[id]/bank-accounts - Get all bank accounts for employee
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

    const bankAccounts = await BankAccount.find({ employeeId: params.id });

    return NextResponse.json({
      success: true,
      data: bankAccounts
    });

  } catch (error) {
    console.error('Error fetching bank accounts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bank accounts' },
      { status: 500 }
    );
  }
}

// POST /api/admin/employees/[id]/bank-accounts - Create new bank account
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      accountNumber,
      accountHolderName,
      bankName,
      branchName,
      ifscCode,
      accountType
    } = body;

    // Validate required fields
    if (!accountNumber || !accountHolderName || !bankName || !ifscCode) {
      return NextResponse.json(
        { error: 'Missing required fields: accountNumber, accountHolderName, bankName, ifscCode' },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify employee exists
    const employee = await User.findById(params.id);
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // Check if account already exists
    const existingAccount = await BankAccount.findOne({
      accountNumber,
      ifscCode
    });

    if (existingAccount) {
      return NextResponse.json(
        { error: 'Bank account with this account number and IFSC already exists' },
        { status: 400 }
      );
    }

    const newBankAccount = new BankAccount({
      employeeId: params.id,
      accountNumber,
      accountHolderName,
      bankName,
      branchName,
      ifscCode: ifscCode.toUpperCase(),
      accountType: accountType || 'Savings',
      createdBy: session.user.id
    });

    await newBankAccount.save();

    return NextResponse.json({
      success: true,
      message: 'Bank account created successfully',
      data: newBankAccount
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating bank account:', error);
    return NextResponse.json(
      { error: 'Failed to create bank account' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/employees/[id]/bank-accounts - Update all bank accounts (replace)
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { bankAccounts } = body;

    if (!Array.isArray(bankAccounts)) {
      return NextResponse.json(
        { error: 'Bank accounts must be an array' },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify employee exists
    const employee = await User.findById(params.id);
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // Delete existing bank accounts
    await BankAccount.deleteMany({ employeeId: params.id });

    // Create new bank accounts
    let createdBankAccounts = [];
    if (bankAccounts.length > 0) {
      const bankAccountRecords = bankAccounts.map(account => ({
        ...account,
        employeeId: params.id,
        ifscCode: account.ifscCode?.toUpperCase(),
        createdBy: session.user.id,
        updatedBy: session.user.id
      }));
      createdBankAccounts = await BankAccount.insertMany(bankAccountRecords);
    }

    return NextResponse.json({
      success: true,
      message: 'Bank accounts updated successfully',
      data: createdBankAccounts
    });

  } catch (error) {
    console.error('Error updating bank accounts:', error);
    return NextResponse.json(
      { error: 'Failed to update bank accounts' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/employees/[id]/bank-accounts - Delete all bank accounts
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

    const result = await BankAccount.deleteMany({ employeeId: params.id });

    return NextResponse.json({
      success: true,
      message: `${result.deletedCount} bank accounts deleted successfully`,
      data: { deletedCount: result.deletedCount }
    });

  } catch (error) {
    console.error('Error deleting bank accounts:', error);
    return NextResponse.json(
      { error: 'Failed to delete bank accounts' },
      { status: 500 }
    );
  }
} 