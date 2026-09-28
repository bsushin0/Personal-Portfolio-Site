/**
 * Braintrust LLM observability helper
 *
 * Logs every LLM call (Claude + Gemini) to the Braintrust dashboard for:
 *   - Latency tracking
 *   - Token usage
 *   - Input/output inspection
 *   - Future: prompt experiments and scoring
 *
 * Project name: "portfolio-ai"
 * Free tier: ~1,000 log entries/month
 * Dashboard: https://www.braintrustdata.com
 *
 * Requires: BRAINTRUST_API_KEY env var
 * Degrades gracefully when not set — all calls are no-ops.
 */

import { initLogger } from "braintrust";

let _logger: ReturnType<typeof initLogger> | null = null;

function getLogger() {
  if (!process.env.BRAINTRUST_API_KEY) return null;
  if (!_logger) {
    _logger = initLogger({
      projectName: "portfolio-ai",
      apiKey: process.env.BRAINTRUST_API_KEY,
      asyncFlush: true, // Non-blocking — never delays HTTP responses
    });
  }
  return _logger;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LLMLogEntry {
  /** Span name shown in Braintrust (e.g. "preflight-briefer", "aira-chat") */
  name: string;
  /** The input sent to the model */
  input: unknown;
  /** The full text output from the model */
  output: string;
  /** The model ID used */
  model?: string;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
  /** Performance metrics */
  metrics?: {
    /** Prompt tokens used */
    prompt_tokens?: number;
    /** Completion tokens used */
    completion_tokens?: number;
    /** Total latency in milliseconds */
    latency_ms?: number;
  };
}

// ─── Logging ──────────────────────────────────────────────────────────────────

/**
 * Log a completed LLM call to Braintrust.
 * Fire-and-forget — does not await flush (asyncFlush handles it in background).
 *
 * @example
 * const start = Date.now();
 * const output = await callLLM(input);
 * logLLMCall({
 *   name: "aira-chat",
 *   input: { query: userQuery, contextChunks: relevantChunks.length },
 *   output,
 *   model: "gemini-3.1-flash-lite",
 *   metrics: { latency_ms: Date.now() - start },
 * });
 */
export function logLLMCall(entry: LLMLogEntry): void {
  const logger = getLogger();
  if (!logger) return;

  try {
    const span = logger.startSpan({
      name: entry.name,
      type: "llm",
    });

    span.log({
      input: entry.input,
      output: entry.output,
      metadata: {
        model: entry.model,
        ...entry.metadata,
      },
      metrics: entry.metrics,
    });

    span.end();

    // Background flush — errors are suppressed so they never affect the user
    logger.flush().catch(() => {});
  } catch {
    // Braintrust errors must never bubble up to users
  }
}
