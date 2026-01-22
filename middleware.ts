import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ipAddress } from '@vercel/edge'

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}

export function middleware(request: NextRequest) {
  // Check if IP whitelisting is enabled
  const whitelistEnabled = process.env.IP_WHITELIST_ENABLED === 'true'
  
  // If whitelisting is disabled, allow all traffic
  if (!whitelistEnabled) {
    return NextResponse.next()
  }

  // Try multiple IP sources for Vercel compatibility
  let ip = ipAddress(request) || 'unknown'

  // Check multiple header sources that Vercel/Cloudflare might use
  const headers = {
    'ipAddress': ip,
    'x-forwarded-for': request.headers.get('x-forwarded-for'),
    'x-real-ip': request.headers.get('x-real-ip'),
    'cf-connecting-ip': request.headers.get('cf-connecting-ip'),
    'true-client-ip': request.headers.get('true-client-ip'),
  }

  // Priority order for IP detection
  if (headers['cf-connecting-ip']) {
    ip = headers['cf-connecting-ip']
  } else if (headers['true-client-ip']) {
    ip = headers['true-client-ip']
  } else if (headers['x-real-ip']) {
    ip = headers['x-real-ip']
  } else if (headers['x-forwarded-for']) {
    ip = headers['x-forwarded-for'].split(',')[0].trim()
  }

  // Get whitelist from environment variable, fallback to localhost only
  const whitelistEnv = process.env.IP_WHITELIST || '127.0.0.1'
  const allowedIPs = whitelistEnv.split(',').map(ip => ip.trim())

  console.log(`=== IP Whitelist Debug ===`)
  console.log(`Detected IP: ${ip}`)
  console.log(`Headers: ${JSON.stringify(headers)}`)
  console.log(`Allowed IPs: ${allowedIPs.join(', ')}`)
  console.log(`IP Allowed: ${allowedIPs.includes(ip)}`)

  // Check if IP is allowed
  if (!allowedIPs.includes(ip)) {
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Access Denied</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
              color: #fff;
              padding: 20px;
            }
            .container {
              text-align: center;
              max-width: 600px;
              padding: 3rem 2rem;
              background: rgba(255, 255, 255, 0.05);
              border-radius: 20px;
              border: 1px solid rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(10px);
              box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
            }
            .icon {
              font-size: 5rem;
              margin-bottom: 1rem;
              animation: pulse 2s ease-in-out infinite;
            }
            @keyframes pulse {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.05); opacity: 0.8; }
            }
            h1 {
              font-size: 2.5rem;
              margin-bottom: 1rem;
              background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              font-weight: 700;
              letter-spacing: -0.02em;
            }
            p {
              color: #9ca3af;
              margin-bottom: 1rem;
              font-size: 1.1rem;
              line-height: 1.6;
            }
            .ip-box {
              background: rgba(6, 182, 212, 0.1);
              border: 1px solid rgba(6, 182, 212, 0.3);
              padding: 1rem;
              border-radius: 10px;
              margin: 1.5rem 0;
            }
            .ip {
              color: #06b6d4;
              font-family: 'Courier New', monospace;
              font-size: 1.2rem;
              font-weight: 600;
            }
            .footer {
              margin-top: 2rem;
              padding-top: 1.5rem;
              border-top: 1px solid rgba(255, 255, 255, 0.1);
              font-size: 0.9rem;
              color: #6b7280;
            }
            @media (max-width: 640px) {
              h1 { font-size: 2rem; }
              .icon { font-size: 3.5rem; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">🔒</div>
            <h1>Access Denied</h1>
            <p>This portfolio is currently private and only accessible to authorized users.</p>
            <div class="ip-box">
              <p style="margin: 0; color: #d1d5db; font-size: 0.9rem;">Your IP Address</p>
              <div class="ip">${ip}</div>
            </div>
            <div class="footer">
              <p>If you believe you should have access, please contact the site owner with your IP address.</p>
            </div>
          </div>
        </body>
      </html>
      `,
      {
        status: 403,
        headers: {
          'content-type': 'text/html',
        },
      }
    )
  }

  // Allow access
  return NextResponse.next()
}
