import { NextResponse } from 'next/server';
import { getClusters } from '@/lib/db';

export async function GET() {
  try {
    const clusters = await getClusters();
    return NextResponse.json(clusters);
  } catch (error) {
    console.error('Error fetching clusters:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}