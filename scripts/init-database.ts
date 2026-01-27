#!/usr/bin/env node

/**
 * Database initialization helper script
 * 
 * Usage:
 *   pnpm tsx scripts/init-database.ts
 * 
 * This script will read the SQL from init-db.sql and execute it
 * against your Neon database using the DATABASE_URL environment variable.
 */

import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: join(process.cwd(), '.env.local') });

async function initDatabase() {
  try {
    // Check for DATABASE_URL
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL environment variable is not set');
      console.log('\nPlease add DATABASE_URL to your .env.local file:');
      console.log('DATABASE_URL=postgresql://user:pass@host.neon.tech/dbname?sslmode=require\n');
      process.exit(1);
    }

    console.log('🔄 Connecting to database...');
    const sql = neon(process.env.DATABASE_URL);

    // Read SQL file
    const sqlPath = join(process.cwd(), 'scripts', 'init-db.sql');
    const sqlContent = readFileSync(sqlPath, 'utf-8');

    console.log('📝 Executing database schema...');
    
    // Execute the main table creation
    await sql`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(500) NOT NULL,
        message TEXT NOT NULL,
        ip_address VARCHAR(45) NOT NULL,
        country VARCHAR(100),
        region VARCHAR(100),
        city VARCHAR(100),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_submitted_at ON contact_submissions (submitted_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_email ON contact_submissions (email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_ip_address ON contact_submissions (ip_address)`;

    console.log('✅ Database initialized successfully!');
    console.log('\nTable created: contact_submissions');
    console.log('Indexes created: idx_submitted_at, idx_email, idx_ip_address\n');

    // Test query
    console.log('🧪 Testing database connection...');
    const result = await sql`SELECT COUNT(*) as count FROM contact_submissions`;
    console.log(`✅ Connection successful! Current submissions: ${result[0].count}\n`);

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initDatabase();
