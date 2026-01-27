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
  os_name?: string;
  device_type?: string;
  
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
      os_name,
      device_type
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
      ${data.os_name || null},
      ${data.device_type || null}
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
