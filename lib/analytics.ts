/**
 * Client-side analytics helper
 *
 * Fires fire-and-forget POST requests to /api/events.
 * Uses sessionStorage to maintain a session ID across page navigations.
 * All failures are silently swallowed — analytics should never break UX.
 */

const SESSION_KEY = "portfolio_session_id";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

/**
 * Track a portfolio interaction event.
 *
 * @param type  - Event type string (matches EventType in mongo-analytics.ts)
 * @param metadata - Optional key/value pairs (e.g. { projectId: 4, departure: "KLAF" })
 */
export function trackEvent(
  type: string,
  metadata?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return; // SSR guard

  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, sessionId: getSessionId(), metadata }),
  }).catch(() => {
    // Silently ignore — analytics failures must never surface to users
  });
}
