import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    alerts: [
      {
        id: 'alert-1',
        title: 'Gate 2 Temporarily Congested',
        message: 'Please use North Entrance Gate 4 for rapid access.',
        severity: 'warning',
        created_at: new Date().toISOString(),
      },
    ],
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json({ success: true, broadcasted: body }, { status: 201 });
}
