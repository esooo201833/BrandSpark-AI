import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { REFERENCE, STATUS } = body;

    console.log(`Perfect Money Status Update - Reference: ${REFERENCE}, Status: ${STATUS}`);

    // Perfect Money will use this endpoint to notify about payment status
    // Respond with OK to acknowledge receipt
    return NextResponse.json(
      {
        success: true,
        message: 'Status received',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Perfect Money status error:', error);
    return NextResponse.json(
      { error: 'Failed to process status' },
      { status: 500 }
    );
  }
}
