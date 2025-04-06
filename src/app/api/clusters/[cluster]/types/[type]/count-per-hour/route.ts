import { NextRequest, NextResponse } from 'next/server';
import { getLogsCountPerHour } from '@/lib/db';

type RouteParams = {
  params: {
    cluster: string;
    type: string;
  }
}

export async function GET(
  request: NextRequest, 
  { params }: RouteParams
) {
  const { cluster, type } = await params;

  try {
    const countPerHour = await getLogsCountPerHour(cluster, type);

    return NextResponse.json({
      countPerHour,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch logs count per day' }, 
      { status: 500 }
    );
  }
}