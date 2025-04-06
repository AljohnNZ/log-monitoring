import { NextResponse, NextRequest } from 'next/server';
import { getTypes } from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ cluster: string }> },
) {
  const { cluster } = await params;
  try {
    const types = await getTypes(cluster);
    return NextResponse.json(types);
  } catch (error) {
    console.error('Error fetching clusters:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}