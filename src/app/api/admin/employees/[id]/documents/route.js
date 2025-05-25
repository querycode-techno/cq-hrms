import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Document from '@/lib/models/document';
import User from '@/lib/models/user';

// GET /api/admin/employees/[id]/documents - Get all documents for employee
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

    const documents = await Document.find({ employeeId: params.id })
      .populate('uploadedBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: documents
    });

  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

// POST /api/admin/employees/[id]/documents - Upload new document
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      documentType,
      documentUrl,
      fileName,
      fileSize,
      mimeType
    } = body;

    // Validate required fields
    if (!documentType || !documentUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: documentType, documentUrl' },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify employee exists
    const employee = await User.findById(params.id);
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // Check if document type already exists for this employee
    const existingDocument = await Document.findOne({
      employeeId: params.id,
      documentType
    });

    if (existingDocument) {
      return NextResponse.json(
        { error: `Document of type '${documentType}' already exists for this employee. Use PUT to update.` },
        { status: 400 }
      );
    }

    const newDocument = new Document({
      employeeId: params.id,
      documentType,
      documentUrl,
      fileName,
      fileSize,
      mimeType,
      uploadedBy: session.user.id
    });

    await newDocument.save();

    // Populate the uploadedBy field for response
    await newDocument.populate('uploadedBy', 'firstName lastName');

    return NextResponse.json({
      success: true,
      message: 'Document uploaded successfully',
      data: newDocument
    }, { status: 201 });

  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/employees/[id]/documents - Update all documents (replace)
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { documents } = body;

    if (!Array.isArray(documents)) {
      return NextResponse.json(
        { error: 'Documents must be an array' },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify employee exists
    const employee = await User.findById(params.id);
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // Delete existing documents
    await Document.deleteMany({ employeeId: params.id });

    // Create new documents
    let createdDocuments = [];
    if (documents.length > 0) {
      const documentRecords = documents.map(doc => ({
        ...doc,
        employeeId: params.id,
        uploadedBy: session.user.id
      }));
      createdDocuments = await Document.insertMany(documentRecords);
      
      // Populate uploadedBy for response
      createdDocuments = await Document.find({ 
        _id: { $in: createdDocuments.map(d => d._id) } 
      }).populate('uploadedBy', 'firstName lastName');
    }

    return NextResponse.json({
      success: true,
      message: 'Documents updated successfully',
      data: createdDocuments
    });

  } catch (error) {
    console.error('Error updating documents:', error);
    return NextResponse.json(
      { error: 'Failed to update documents' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/employees/[id]/documents - Delete all documents
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const documentType = searchParams.get('type');

    await connectDB();

    // Verify employee exists
    const employee = await User.findById(params.id);
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    let result;
    if (documentType) {
      // Delete specific document type
      result = await Document.deleteMany({ 
        employeeId: params.id,
        documentType 
      });
    } else {
      // Delete all documents
      result = await Document.deleteMany({ employeeId: params.id });
    }

    return NextResponse.json({
      success: true,
      message: `${result.deletedCount} document(s) deleted successfully`,
      data: { deletedCount: result.deletedCount }
    });

  } catch (error) {
    console.error('Error deleting documents:', error);
    return NextResponse.json(
      { error: 'Failed to delete documents' },
      { status: 500 }
    );
  }
} 