import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { healthCheck } from '@/lib/db-config';

export async function GET() {
  try {
    // Connect to database
    await connectDB();
    
    // Perform health check
    const health = await healthCheck();
    
    return NextResponse.json({
      message: 'API is healthy',
      database: health,
      timestamp: new Date().toISOString(),
    }, { status: 200 });
    
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      message: 'API health check failed',
      error: error.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 