# Visit Analytics & Logging

This document describes the visit logging system for the portfolio site.

## Overview

The visit logging system tracks:
- **IP Address**: Visitor's IP address
- **Geolocation**: Country, region, city, coordinates, timezone, ISP
- **Browser Info**: Browser name/version, OS, device type
- **Page Data**: Page URL visited, referrer
- **Timestamp**: When the visit occurred

## Database Setup

### Create Tables

Run the migration in `scripts/init-db.sql`:

```bash
# Using Neon dashboard SQL editor
# Copy contents of scripts/init-db.sql and execute
```

This creates:
- `visit_logs` table: Stores all visit records
- `visit_logs_summary` view: Aggregated analytics

## API Endpoint

### Log a Visit

```
POST /api/log-visit
Content-Type: application/json

{
  "pageUrl": "/",
  "referrer": "https://google.com"
}
```

**Response:**
```json
{
  "message": "Visit logged successfully",
  "logged": true,
  "location": "San Francisco, California, United States"
}
```

### Client-Side Integration

Add to your main layout or page component:

```typescript
// Log visit on page load
useEffect(() => {
  if (typeof window !== 'undefined') {
    fetch('/api/log-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageUrl: window.location.pathname,
        referrer: document.referrer,
      }),
    }).catch(err => console.log('Visit logging disabled or failed'));
  }
}, []);
```

## Excluded IPs

By default, these IPs are excluded from logging:
- `127.0.0.1` - Localhost IPv4
- `::1` - Localhost IPv6
- `::ffff:127.0.0.1` - IPv4-mapped IPv6 localhost

### Add More Excluded IPs

Set the `EXCLUDED_IPS` environment variable in `.env.local` or Vercel:

```env
EXCLUDED_IPS=127.0.0.1,::1,72.12.197.21,192.168.1.100
```

## Bot Detection

Common bot user agents are automatically excluded:
- Googlebot, Bingbot
- FacebookExternalHit, LinkedInBot, TwitterBot
- Other crawlers and spiders

## Geolocation Data

Uses **ip-api.com** free tier:
- 45 requests per minute
- Accuracy: ~65-75% for city level
- Free for non-commercial use

### Alternative Services

For higher accuracy, consider:
- **MaxMind GeoIP2** (~95% city accuracy, paid)
- **IPStack** (91-94% accuracy, paid)
- **Cloudflare** (built-in geolocation headers)

To use Cloudflare headers instead:

```typescript
const ip = req.headers.get('cf-connecting-ip') || 
           req.headers.get('x-forwarded-for')?.split(',')[0];
const country = req.headers.get('cf-ipcountry');
const latitude = req.headers.get('cf-metro-code');
```

## Analytics Queries

### Total Unique Visitors (Last 30 Days)

```sql
SELECT COUNT(DISTINCT ip_address) as unique_visitors
FROM visit_logs
WHERE visited_at > NOW() - INTERVAL '30 days';
```

### Top Countries

```sql
SELECT country, COUNT(*) as visits
FROM visit_logs
WHERE visited_at > NOW() - INTERVAL '7 days'
GROUP BY country
ORDER BY visits DESC
LIMIT 10;
```

### Browser Distribution

```sql
SELECT browser_name, COUNT(*) as visits
FROM visit_logs
WHERE visited_at > NOW() - INTERVAL '30 days'
GROUP BY browser_name
ORDER BY visits DESC;
```

### Device Type Distribution

```sql
SELECT device_type, COUNT(*) as visits
FROM visit_logs
WHERE visited_at > NOW() - INTERVAL '30 days'
GROUP BY device_type;
```

### Daily Visitor Trend

```sql
SELECT 
  DATE(visited_at) as visit_date,
  COUNT(DISTINCT ip_address) as unique_visitors,
  COUNT(*) as total_visits
FROM visit_logs
WHERE visited_at > NOW() - INTERVAL '90 days'
GROUP BY DATE(visited_at)
ORDER BY visit_date DESC;
```

## Privacy & Compliance

⚠️ **Important:**
- **Inform users** about IP logging in your privacy policy
- **GDPR Compliance**: IP addresses are personal data; ensure proper consent
- **Data Retention**: Consider implementing automatic deletion (e.g., delete logs older than 90 days)
- **User Rights**: Allow users to request their data be deleted

### Add Privacy Notice

Update your Privacy Policy to include:
```
We collect anonymized visit data including:
- IP address and geolocation
- Browser and device information
- Pages visited

This data is used for analytics and site improvement purposes only.
Personal information is not shared with third parties.
```

## Security Considerations

1. **Rate Limiting**: The endpoint logs all visits; consider adding rate limiting
2. **IP Spoofing**: Trust headers in order: `CF-Connecting-IP` > `X-Real-IP` > `X-Forwarded-For`
3. **Database Credentials**: Never expose DATABASE_URL in client code
4. **Access Control**: Implement authentication for analytics dashboard

## Troubleshooting

### Geolocation API Fails

If `ip-api.com` rate limit is exceeded:
```
Geolocation lookup failed: "You have been rate limited"
```

Solution: Wait 1 minute, or switch to cached service or Cloudflare headers.

### Missing Visit Logs

Check:
1. Is the IP in `EXCLUDED_IPS`?
2. Is the user agent a bot?
3. Is `DATABASE_URL` configured?
4. Are there database connection errors?

Enable debug logging:
```typescript
console.log('Visit logged:', { ip, country: geoData.country, browser: uaData.browserName });
```

## Performance Impact

- **API Call**: ~200ms per visit (includes geolocation lookup)
- **Database Insert**: ~10ms
- **Total**: ~210ms, minimal impact on page load
- **Best Practice**: Fire-and-forget; don't wait for response

## Retention Policy

The visit logging system automatically deletes logs older than **30 days** to comply with data minimization principles and reduce storage costs.

### Database-Level Cleanup

A stored procedure `cleanup_old_visit_logs()` is created in the database migration:

```sql
-- Run manually in Neon console
SELECT cleanup_old_visit_logs(30);  -- Cleanup logs older than 30 days

-- Or use default (30 days)
SELECT cleanup_old_visit_logs();
```

### API Cleanup Endpoint

**Trigger cleanup via API:**

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_CLEANUP_SECRET" \
  "https://your-site.com/api/admin/cleanup-logs?days=30"
```

**Response:**
```json
{
  "success": true,
  "message": "Cleanup scheduled for logs older than 30 days",
  "retentionDays": 30,
  "timestamp": "2026-01-30T12:00:00.000Z"
}
```

### Setup Automated Cleanup

**Option 1: GitHub Actions (Recommended)**

Create `.github/workflows/cleanup-logs.yml`:

```yaml
name: Cleanup Old Visit Logs
on:
  schedule:
    # Run daily at 2 AM UTC
    - cron: '0 2 * * *'

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - name: Cleanup visit logs
        run: |
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.CLEANUP_SECRET }}" \
            "https://your-site.com/api/admin/cleanup-logs?days=30"
```

**Option 2: External Cron Service (EasyCron)**

1. Go to [https://www.easycron.com/](https://www.easycron.com/)
2. Create new cron job
3. Set URL:
   ```
   https://your-site.com/api/admin/cleanup-logs?days=30
   ```
4. Add custom header:
   ```
   Authorization: Bearer YOUR_CLEANUP_SECRET
   ```
5. Set frequency: Daily (or your preference)

**Option 3: PostgreSQL Native Schedule (Neon Pro)**

If using Neon Pro with Extensions:

```sql
-- Install pg_cron extension (requires Neon Pro)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule cleanup daily at 2 AM
SELECT cron.schedule('cleanup-visit-logs', '0 2 * * *', 
  'SELECT cleanup_old_visit_logs(30)');
```

### Configure Cleanup Secret

Set the `CLEANUP_SECRET` environment variable:

**Local development (.env.local):**
```env
CLEANUP_SECRET=your-secure-random-secret-here
```

**Vercel Dashboard:**
1. Project Settings → Environment Variables
2. Add variable: `CLEANUP_SECRET`
3. Set value to a secure random string (e.g., use `openssl rand -hex 32`)

### Adjust Retention Period

To keep logs longer (or shorter), modify:

**In .env:**
```env
# Change retention to 60 days
RETENTION_DAYS=60
```

**In API call:**
```bash
# Keep logs for 90 days
curl -X POST \
  -H "Authorization: Bearer YOUR_CLEANUP_SECRET" \
  "https://your-site.com/api/admin/cleanup-logs?days=90"
```

### Verify Cleanup is Working

Check remaining logs:

```sql
-- Total logs in database
SELECT COUNT(*) as total_logs FROM visit_logs;

-- Logs by date
SELECT DATE(visited_at) as date, COUNT(*) as count
FROM visit_logs
GROUP BY DATE(visited_at)
ORDER BY date DESC;

-- Oldest log timestamp
SELECT MIN(visited_at) as oldest_log FROM visit_logs;
```

After cleanup runs, oldest log should be within retention period (e.g., last 30 days).

## Privacy & Compliance

⚠️ **Important:**
- **Inform users** about IP logging in your privacy policy
- **GDPR Compliance**: IP addresses are personal data; ensure proper consent
- **Data Retention**: Logs are automatically deleted after 30 days (configurable)
- **User Rights**: Allow users to request their data be deleted

### Add Privacy Notice

Update your Privacy Policy to include:
```
We collect anonymized visit data including:
- IP address and geolocation
- Browser and device information
- Pages visited

This data is used for analytics and site improvement purposes only.
Personal information is not shared with third parties.

Visit logs are retained for 30 days, then automatically deleted.
```

## Future Enhancements

- [ ] Implement analytics dashboard at `/admin/analytics`
- [ ] Add session tracking (group multiple visits by IP + user agent)
- [ ] Implement event tracking (button clicks, form submissions, etc.)
- [ ] Export analytics to CSV/JSON
- [ ] Heatmap/scroll tracking
- [ ] Real-time visitor notifications
- [ ] Data export before deletion
