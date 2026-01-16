import { NextRequest, NextResponse } from 'next/server'
import { ipAddress } from '@vercel/edge'

export async function GET(request: NextRequest) {
  const ip = ipAddress(request) || 'unknown'

  const headers = {
    'ipAddress': ip,
    'x-forwarded-for': request.headers.get('x-forwarded-for'),
    'x-real-ip': request.headers.get('x-real-ip'),
    'cf-connecting-ip': request.headers.get('cf-connecting-ip'),
    'true-client-ip': request.headers.get('true-client-ip'),
    'user-agent': request.headers.get('user-agent'),
  }

  // Determine detected IP with priority
  let detectedIP = ip
  if (headers['cf-connecting-ip']) {
    detectedIP = headers['cf-connecting-ip']
  } else if (headers['true-client-ip']) {
    detectedIP = headers['true-client-ip']
  } else if (headers['x-real-ip']) {
    detectedIP = headers['x-real-ip']
  } else if (headers['x-forwarded-for']) {
    detectedIP = headers['x-forwarded-for'].split(',')[0].trim()
  }

  return NextResponse.json({
    message: 'Your IP Address Debug Information',
    detectedIP,
    allHeaders: headers,
    whitelistValue: process.env.IP_WHITELIST,
    isAllowed: (process.env.IP_WHITELIST || '127.0.0.1').split(',').map(ip => ip.trim()).includes(detectedIP),
  })
}
