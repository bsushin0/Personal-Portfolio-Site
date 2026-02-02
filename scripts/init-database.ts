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
    
    // Create contact_submissions table
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
        user_agent TEXT,
        browser_name VARCHAR(100),
        os_name VARCHAR(100),
        device_type VARCHAR(50),
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create visit_logs table
    await sql`
      CREATE TABLE IF NOT EXISTS visit_logs (
        id SERIAL PRIMARY KEY,
        ip_address VARCHAR(45) NOT NULL,
        country VARCHAR(100),
        region VARCHAR(100),
        city VARCHAR(100),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        timezone VARCHAR(50),
        isp VARCHAR(255),
        user_agent TEXT,
        browser_name VARCHAR(100),
        browser_version VARCHAR(50),
        os_name VARCHAR(100),
        os_version VARCHAR(50),
        device_type VARCHAR(50),
        page_url VARCHAR(500),
        referrer VARCHAR(500),
        visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create indexes for contact_submissions
    await sql`CREATE INDEX IF NOT EXISTS idx_contact_submitted_at ON contact_submissions (submitted_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_contact_email ON contact_submissions (email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_contact_ip ON contact_submissions (ip_address)`;

    // Create indexes for visit_logs
    await sql`CREATE INDEX IF NOT EXISTS idx_visit_visited_at ON visit_logs (visited_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_visit_ip ON visit_logs (ip_address)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_visit_country ON visit_logs (country)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_visit_device ON visit_logs (device_type)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_visit_browser ON visit_logs (browser_name)`;

    console.log('✅ Database initialized successfully!');
    console.log('\nTables created: contact_submissions, visit_logs');
    console.log('Indexes created for both tables\n');

    // Test queries
    console.log('🧪 Testing database connection...');
    const contactResult = await sql`SELECT COUNT(*) as count FROM contact_submissions`;
    const visitResult = await sql`SELECT COUNT(*) as count FROM visit_logs`;
    console.log(`✅ Connection successful!`);
    console.log(`   Contact submissions: ${contactResult[0].count}`);
    console.log(`   Visit logs: ${visitResult[0].count}\n`);

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initDatabase();
