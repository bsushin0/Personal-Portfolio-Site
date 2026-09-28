'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

export function VisitTracker() {
  useEffect(() => {
    // Track visit on page load
    const trackVisit = async () => {
      try {
        // Get current page URL and referrer
        const pageUrl = typeof window !== 'undefined' ? window.location.href : undefined
        const referrer = typeof document !== 'undefined' ? document.referrer : undefined

        // Call the visit logging endpoint (Neon — IP + geo + UA)
        const response = await fetch('/api/log-visit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pageUrl,
            referrer,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          console.log('✅ Visit tracked:', data.location)
        } else {
          console.warn('Visit tracking response:', response.status)
        }
      } catch (error) {
        // Silently fail - don't impact user experience
        console.warn('Visit tracking error:', error)
      }

      // Also log a page_view event to MongoDB analytics (fine-grained interaction tracking)
      trackEvent('page_view', {
        path: typeof window !== 'undefined' ? window.location.pathname : undefined,
        referrer: typeof document !== 'undefined' ? document.referrer || undefined : undefined,
      })
    }

    // Track visit after a small delay to not block page load
    const timer = setTimeout(trackVisit, 1000)

    return () => clearTimeout(timer)
  }, [])

  return null
}
