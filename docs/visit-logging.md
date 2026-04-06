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

Add more via the `EXCLUDED_IPS` environment variable:

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

## Retention Policy

Logs are automatically deleted after **30 days** (configurable via `RETENTION_DAYS` env var).

### Manual Cleanup
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_CLEANUP_SECRET" \
  "https://your-site.com/api/admin/cleanup-logs?days=30"
```

### Automated Cleanup (GitHub Actions)
```yaml
name: Cleanup Old Visit Logs
on:
  schedule:
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

## Privacy & Compliance

- **Inform users** about IP logging in your privacy policy
- **GDPR Compliance**: IP addresses are personal data; ensure proper consent
- **Data Retention**: Logs auto-deleted after 30 days (configurable)
- **User Rights**: Allow users to request their data be deleted

## Troubleshooting

### Geolocation API Fails
If `ip-api.com` rate limit is exceeded, wait 1 minute or switch to Cloudflare headers:
```typescript
const ip = req.headers.get('cf-connecting-ip') ||
           req.headers.get('x-forwarded-for')?.split(',')[0];
const country = req.headers.get('cf-ipcountry');
```

### Missing Visit Logs
Check:
1. Is the IP in `EXCLUDED_IPS`?
2. Is the user agent a bot?
3. Is `DATABASE_URL` configured?
4. Are there database connection errors?
