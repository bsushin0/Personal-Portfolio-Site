import { config } from 'dotenv';
import { join } from 'path';
import { getDb } from '@/lib/db';

// Load environment variables from .env.local
config({ path: join(process.cwd(), '.env.local') });

async function checkDatabase() {
  const sql = getDb();
  
  console.log('🔍 Checking database connection...\n');
  
  // Check visit logs
  const visitCount = await sql`SELECT COUNT(*) as count FROM visit_logs`;
  console.log(`📊 Visit logs: ${visitCount[0].count} records`);
  
  if (parseInt(visitCount[0].count) > 0) {
    const visits = await sql`SELECT * FROM visit_logs ORDER BY visited_at DESC LIMIT 5`;
    console.log('\n✅ Latest visits:');
    visits.forEach(v => {
      console.log(`   ${v.ip_address} | ${v.country || 'Unknown'} | ${v.browser_name} | ${v.visited_at}`);
    });
  } else {
    console.log('\n❌ No visits recorded yet!');
    console.log('\nDebugging info:');
    
    // Check table structure
    const cols = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'visit_logs'
      ORDER BY ordinal_position
    `;
    console.log('\n📋 Table columns:');
    cols.forEach(c => console.log(`   - ${c.column_name}: ${c.data_type}`));
    
    // Test insert
    console.log('\n🧪 Testing insert...');
    try {
      const testResult = await sql`
        INSERT INTO visit_logs (
          ip_address, country, browser_name, device_type
        ) VALUES (
          '127.0.0.1', 'Test', 'TestBrowser', 'Desktop'
        ) RETURNING id, visited_at
      `;
      console.log('✅ Test insert successful:', testResult[0]);
      
      // Delete test record
      await sql`DELETE FROM visit_logs WHERE ip_address = '127.0.0.1'`;
      console.log('✅ Test record cleaned up');
    } catch (err) {
      console.error('❌ Insert failed:', err);
    }
  }
}

checkDatabase().catch(console.error);
