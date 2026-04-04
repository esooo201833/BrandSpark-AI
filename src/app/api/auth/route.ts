import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await request.json();
    // Simple mock authentication
    return NextResponse.json({ success: true, message: 'Logged in' });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Auth error:', err.message);
    return NextResponse.json({ error: 'Auth failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ authenticated: false });
}
