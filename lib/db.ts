import { neon } from '@neondatabase/serverless';

// Initialize Neon client with the DATABASE_URL
export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  return neon(process.env.DATABASE_URL);
}

// Contact form submission type
export interface ContactSubmission {
  id?: number;
  
  // Form data
  name: string;
  email: string;
  subject: string;
  message: string;
  
  // Geolocation data
  ip_address: string;
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  
  // User agent and browser information
  user_agent?: string;
  browser_name?: string;
  browser_version?: string;
  os_name?: string;
  os_version?: string;
  device_type?: string;
  
  // Request metadata
  referrer?: string;
  accept_language?: string;
  timezone_offset?: number;
  screen_width?: number;
  screen_height?: number;
  viewport_width?: number;
  viewport_height?: number;
  is_mobile?: boolean;
  language?: string;
  
  // Timestamps
  submitted_at?: Date;
}

// Save contact form submission with IP, geolocation, and user agent data
export async function saveContactSubmission(data: ContactSubmission) {
  const sql = getDb();
  
  const result = await sql`
    INSERT INTO contact_submissions (
      name,
      email,
      subject,
      message,
      ip_address,
      country,
      region,
      city,
      latitude,
      longitude,
      user_agent,
      browser_name,
      browser_version,
      os_name,
      os_version,
      device_type,
      referrer,
      accept_language,
      timezone_offset,
      screen_width,
      screen_height,
      viewport_width,
      viewport_height,
      is_mobile,
      language
    )
    VALUES (
      ${data.name},
      ${data.email},
      ${data.subject},
      ${data.message},
      ${data.ip_address},
      ${data.country || null},
      ${data.region || null},
      ${data.city || null},
      ${data.latitude || null},
      ${data.longitude || null},
      ${data.user_agent || null},
      ${data.browser_name || null},
      ${data.browser_version || null},
      ${data.os_name || null},
      ${data.os_version || null},
      ${data.device_type || null},
      ${data.referrer || null},
      ${data.accept_language || null},
      ${data.timezone_offset || null},
      ${data.screen_width || null},
      ${data.screen_height || null},
      ${data.viewport_width || null},
      ${data.viewport_height || null},
      ${data.is_mobile || false},
      ${data.language || null}
    )
    RETURNING id, submitted_at
  `;
  
  return result[0];
}

// Get all contact submissions (for admin dashboard, future feature)
export async function getAllContactSubmissions() {
  const sql = getDb();
  
  const result = await sql`
    SELECT 
      id,
      name,
      email,
      subject,
      message,
      ip_address,
      country,
      region,
      city,
      latitude,
      longitude,
      submitted_at
    FROM contact_submissions
    ORDER BY submitted_at DESC
  `;
  
  return result;
}

// Get IP geolocation using free ip-api.com service
export async function getIpGeolocation(ip: string): Promise<Partial<ContactSubmission>> {
  try {
    // Skip localhost/private IPs
    if (ip === '127.0.0.1' || ip === 'localhost' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      return {
        country: 'Local',
        region: 'Local',
        city: 'Local',
        latitude: 0,
        longitude: 0,
      };
    }

    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,lat,lon`);
    const data = await response.json();

    if (data.status === 'success') {
      return {
        country: data.country,
        region: data.regionName,
        city: data.city,
        latitude: data.lat,
        longitude: data.lon,
      };
    }

    return {};
  } catch (error) {
    console.error('Failed to fetch IP geolocation:', error);
    return {};
  }
}
