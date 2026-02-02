import { NextRequest, NextResponse } from 'next/server';
import { saveVisitLog, getIpGeolocation } from '@/lib/db';
import type { VisitLog } from '@/lib/db';

// IPs to exclude from visit logging (development, personal, bots)
// TEMPORARILY DISABLED FOR TESTING - All IPs will be logged
const EXCLUDED_IPS = process.env.EXCLUDED_IPS 
  ? process.env.EXCLUDED_IPS.split(',').map(ip => ip.trim())
  : [
      // '127.0.0.1',      // Localhost IPv4
      // '::1',            // Localhost IPv6
      // '::ffff:127.0.0.1', // IPv4-mapped IPv6 localhost
      // '72.12.197.21',  // My home IP 
      // '128.210.106.68', // My campus IP 
    ];

// Common bot user agents to exclude
const BOT_PATTERNS = [
  'bot',
  'crawler',
  'spider',
  'googlebot',
  'bingbot',
  'yahoo',
  'facebookexternalhit',
  'linkedinbot',
  'twitterbot',
  'slurp',
  'baidu',
  'yandex',
];

interface GeolocationData {
  ip: string;
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  isp?: string;
}

async function getGeolocation(ip: string) {
  try {
    // Using ip-api.com free tier (45 requests per minute)
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,lat,lon,timezone,isp`, {
      headers: { 'User-Agent': 'Portfolio-Analytics' },
    });

    if (!response.ok) {
      console.error('Geolocation API error:', response.status);
      return { ip };
    }

    const data = await response.json();

    if (data.status !== 'success') {
      console.warn(`Geolocation lookup failed for ${ip}:`, data.message);
      return { ip };
    }

    return {
      ip,
      country: data.country,
      region: data.regionName,
      city: data.city,
      latitude: data.lat,
      longitude: data.lon,
      timezone: data.timezone,
      isp: data.isp,
    };
  } catch (error) {
    console.error('Geolocation fetch error:', error);
    return { ip };
  }
}

function parseUserAgent(userAgent: string) {
  // Simple user agent parsing (in production, use a library like ua-parser-js)
  const browserMatch = userAgent.match(/(Chrome|Safari|Firefox|Edge|Opera|IE)\/([^\s]+)/i);
  const osMatch = userAgent.match(/(Windows|Mac|Linux|Android|iOS|iPhone|iPad)/i);
  const mobileMatch = userAgent.match(/(Mobile|Android|iPhone|iPad)/i);

  return {
    browserName: browserMatch ? browserMatch[1] : 'Unknown',
    browserVersion: browserMatch ? browserMatch[2] : null,
    osName: osMatch ? osMatch[1] : 'Unknown',
    osVersion: null,
    deviceType: mobileMatch ? 'Mobile' : 'Desktop',
  };
}

function isBot(userAgent: string): boolean {
  const lowerUserAgent = userAgent.toLowerCase();
  return BOT_PATTERNS.some(pattern => lowerUserAgent.includes(pattern));
}

export async function POST(req: NextRequest) {
  try {
    // Extract IP address
    const ip = (req.headers.get('x-forwarded-for')?.split(',')[0].trim()) || 
               (req.headers.get('x-real-ip')) || 
               'Unknown';

    // Check if IP is excluded
    if (EXCLUDED_IPS.includes(ip)) {
      return NextResponse.json(
        { message: 'Visit not logged (excluded IP)', logged: false },
        { status: 200 }
      );
    }

    // Parse request body
    const body = await req.json().catch(() => ({}));
    const { pageUrl, referrer } = body;

    // Get user agent
    const userAgent = req.headers.get('user-agent') || 'Unknown';

    // Check if it's a bot
    if (isBot(userAgent)) {
      return NextResponse.json(
        { message: 'Visit not logged (bot detected)', logged: false },
        { status: 200 }
      );
    }

    // Get geolocation data
    const geoData = await getGeolocation(ip);

    // Parse user agent
    const uaData = parseUserAgent(userAgent);

    // Check database connection
    if (!process.env.DATABASE_URL) {
      console.warn('DATABASE_URL not set, skipping visit logging');
      return NextResponse.json(
        { message: 'Database not configured', logged: false },
        { status: 200 }
      );
    }

    // Save visit log to database
    try {
      const visitData = {
        ip_address: ip,
        country: geoData.country,
        region: geoData.region,
        city: geoData.city,
        latitude: geoData.latitude,
        longitude: geoData.longitude,
        timezone: geoData.timezone,
        isp: geoData.isp,
        user_agent: userAgent,
        browser_name: uaData.browserName,
        browser_version: uaData.browserVersion || undefined,
        os_name: uaData.osName,
        os_version: uaData.osVersion || undefined,
        device_type: uaData.deviceType,
        page_url: pageUrl,
        referrer: referrer,
      };
      
      console.log('📝 Attempting to save visit:', JSON.stringify(visitData, null, 2));
      
      const result = await saveVisitLog(visitData);
      
      console.log('✅ Visit logged to database successfully!', { 
        id: result.id, 
        visited_at: result.visited_at,
        ip, 
        country: geoData.country, 
        browser: uaData.browserName, 
        device: uaData.deviceType 
      });
    } catch (dbError) {
      console.error('❌ Failed to save visit to database:');
      console.error('Error name:', (dbError as any)?.name);
      console.error('Error message:', (dbError as any)?.message);
      console.error('Error stack:', (dbError as any)?.stack);
      console.error('Full error:', JSON.stringify(dbError, Object.getOwnPropertyNames(dbError as any)));
      // Don't fail the request if database save fails
    }

    return NextResponse.json(
      { 
        message: 'Visit logged successfully',
        logged: true,
        location: `${geoData.city}, ${geoData.region}, ${geoData.country}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Visit logging error:', error);
    return NextResponse.json(
      { error: 'Failed to log visit' },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint for analytics dashboard
export async function GET(req: NextRequest) {
  // Implement access control here (check auth token, IP, etc.)
  // This would return aggregated analytics data

  return NextResponse.json(
    { 
      message: 'Visit analytics endpoint',
      note: 'Implement authentication and analytics retrieval here'
    },
    { status: 200 }
  );
}
