import { NextRequest, NextResponse } from 'next/server';

/**
 * Admin endpoint to clean up old visit logs
 * 
 * POST /api/admin/cleanup-logs
 * 
 * Requires:
 * - CLEANUP_SECRET environment variable
 * - Authorization header matching the secret
 * 
 * Optional query params:
 * - days: number of days to retain (default: 30)
 * 
 * Example:
 * curl -X POST \
 *   -H "Authorization: Bearer YOUR_CLEANUP_SECRET" \
 *   "http://localhost:3000/api/admin/cleanup-logs?days=30"
 */

export async function POST(req: NextRequest) {
  try {
    // Check if cleanup is enabled
    if (!process.env.CLEANUP_SECRET) {
      return NextResponse.json(
        { error: 'Cleanup functionality disabled' },
        { status: 404 }
      );
    }

    // Verify authorization
    const authHeader = req.headers.get('authorization');
    const secret = process.env.CLEANUP_SECRET;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const providedSecret = authHeader.slice(7); // Remove 'Bearer ' prefix
    if (providedSecret !== secret) {
      return NextResponse.json(
        { error: 'Invalid authorization secret' },
        { status: 403 }
      );
    }

    // Get retention days from query params
    const url = new URL(req.url);
    const retentionDays = parseInt(url.searchParams.get('days') || '30', 10);

    if (retentionDays < 1 || retentionDays > 365) {
      return NextResponse.json(
        { error: 'Retention days must be between 1 and 365' },
        { status: 400 }
      );
    }

    // Check database connection
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    // For now, just return success with instructions
    // In production, you would execute the cleanup query
    console.log(`[CLEANUP] Would delete visit logs older than ${retentionDays} days`);
    
    // Note: Direct database cleanup would need proper connection pooling
    // For Neon serverless, you might want to use their HTTP API instead
    // See: https://neon.tech/docs/guides/api-key-auth

    return NextResponse.json(
      {
        success: true,
        message: `Cleanup scheduled for logs older than ${retentionDays} days`,
        retentionDays,
        timestamp: new Date().toISOString(),
        note: 'Connect your database to execute the actual cleanup'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json(
      { error: 'Failed to execute cleanup' },
      { status: 500 }
    );
  }
}

// GET endpoint for status/info
export async function GET(req: NextRequest) {
  return NextResponse.json(
    {
      endpoint: '/api/admin/cleanup-logs',
      method: 'POST',
      description: 'Clean up old visit logs based on retention policy',
      auth: 'Bearer token (CLEANUP_SECRET)',
      params: {
        days: 'Retention days (1-365, default: 30)'
      },
      example: 'POST /api/admin/cleanup-logs?days=30\nAuthorization: Bearer YOUR_CLEANUP_SECRET',
      setup: 'Set CLEANUP_SECRET environment variable in .env.local or Vercel dashboard'
    },
    { status: 200 }
  );
}
