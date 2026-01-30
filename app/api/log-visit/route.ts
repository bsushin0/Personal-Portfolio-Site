import { NextRequest, NextResponse } from 'next/server';

// IPs to exclude from visit logging (development, personal, bots)
const EXCLUDED_IPS = process.env.EXCLUDED_IPS 
  ? process.env.EXCLUDED_IPS.split(',').map(ip => ip.trim())
  : [
      '127.0.0.1',      // Localhost IPv4
      '::1',            // Localhost IPv6
      '::ffff:127.0.0.1', // IPv4-mapped IPv6 localhost
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

async function getGeolocation(ip: string): Promise<GeolocationData> {
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

    // Log visit to database
    // Note: For serverless environments, use Neon's HTTP API or direct SQL execution
    // See: https://neon.tech/docs/guides/sql-over-http
    
    // Example: You can call Neon's SQL API here like:
    // const result = await fetch('https://api.neon.tech/sql', { ... })
    
    // For now, we log to console and return success
    console.log('Visit logged:', { ip, country: geoData.country, browser: uaData.browserName, device: uaData.deviceType });

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
