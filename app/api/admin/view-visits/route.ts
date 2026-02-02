import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    console.log('📊 Fetching all visit logs...');
    
    const sql = getDb();
    const visits = await sql`
      SELECT 
        id,
        ip_address,
        country,
        region,
        city,
        browser_name,
        os_name,
        device_type,
        page_url,
        referrer,
        visited_at
      FROM visit_logs
      ORDER BY visited_at DESC
      LIMIT 100
    `;
    
    console.log(`✅ Found ${visits.length} visits`);
    
    return NextResponse.json({
      status: 'success',
      count: visits.length,
      visits: visits
    }, { status: 200 });
    
  } catch (error) {
    console.error('❌ Failed to fetch visits:', error);
    return NextResponse.json({
      status: 'error',
      error: (error as any)?.message || 'Unknown error'
    }, { status: 500 });
  }
}
