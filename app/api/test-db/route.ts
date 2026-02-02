import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    console.log('🧪 Testing database connection...');
    
    // Test 1: Check if we can connect
    console.log('1️⃣ Attempting to query visit_logs table...');
    const sql = getDb();
    const result = await sql`SELECT COUNT(*) as count FROM visit_logs`;
    console.log('✅ Connection successful! Visit logs count:', result[0].count);
    
    // Test 2: Try a test insert
    console.log('2️⃣ Attempting test insert...');
    const insertResult = await sql`
      INSERT INTO visit_logs (
        ip_address, country, browser_name, device_type
      ) VALUES (
        '203.0.113.1', 'Test Country', 'TestBrowser', 'Desktop'
      ) RETURNING id, visited_at
    `;
    console.log('✅ Test insert successful:', insertResult[0]);
    
    // Test 3: Verify it was saved
    console.log('3️⃣ Verifying insert...');
    const checkResult = await sql`SELECT * FROM visit_logs WHERE ip_address = '203.0.113.1'`;
    console.log('✅ Verification successful! Found:', checkResult.length, 'records');
    
    // Test 4: Clean up
    console.log('4️⃣ Cleaning up test data...');
    await sql`DELETE FROM visit_logs WHERE ip_address = '203.0.113.1'`;
    console.log('✅ Cleanup successful!');
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection and inserts working perfectly!',
      tests: {
        connection: 'passed',
        insert: 'passed',
        verification: 'passed',
        cleanup: 'passed'
      }
    });
    
  } catch (error) {
    console.error('❌ Database test failed:');
    console.error('Error name:', (error as any)?.name);
    console.error('Error message:', (error as any)?.message);
    console.error('Error stack:', (error as any)?.stack);
    console.error('Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error as any)));
    
    return NextResponse.json({
      status: 'error',
      message: 'Database test failed',
      error: (error as any)?.message
    }, { status: 500 });
  }
}
