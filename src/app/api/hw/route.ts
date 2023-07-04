import { NextResponse } from 'next/server';

export const GET = async () =>
  new NextResponse(JSON.stringify('Hello World!'), {
    headers: { 'Content-Type': 'application/json' },
  });
