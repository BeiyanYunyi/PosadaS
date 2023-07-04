import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) =>
  new NextResponse(JSON.stringify('Hello World!'), {
    headers: { 'Content-Type': 'application/json' },
  });
