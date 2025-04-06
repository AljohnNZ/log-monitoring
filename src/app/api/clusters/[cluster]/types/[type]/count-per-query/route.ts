import { NextRequest, NextResponse } from 'next/server';
import { getLogsCountPerQuery } from '@/lib/db';

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
    const countPerQuery = await getLogsCountPerQuery(cluster, type);

    return NextResponse.json({
      countPerQuery,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch logs count per query' }, { status: 500 });
  }
}