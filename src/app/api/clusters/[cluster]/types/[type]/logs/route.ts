// app/api/clusters/[cluster]/types/[type]/logs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { 
  getLogs, 
  getLogsCount
} from '@/lib/db';

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
  const { searchParams } = new URL(request.url);
  
  const limit = parseInt(searchParams.get('limit') || '100', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);
  const duration = parseFloat(searchParams.get('minDuration') || '0.5');

  try {
    const logs = await getLogs(cluster, type, duration, limit, offset);
    const count = await getLogsCount(cluster, type, duration);

    return NextResponse.json({
      logs,
      count,
      offset,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}