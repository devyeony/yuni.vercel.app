/*
 * Fixed-window in-memory rate limiter — the default guard for API routes.
 * State is per serverless instance, so this bounds each instance rather
 * than the global rate; accepted trade-off for endpoints that only serve
 * public read-only content (no paid backend, no external store).
 */

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSeconds: number };

export function rateLimit(
  key: string,
  { limit = 60, windowMs = 60_000 } = {},
): RateLimitResult {
  const now = Date.now();
  const current = windows.get(key);

  if (!current || current.resetAt <= now) {
    // Opportunistic cleanup so abandoned keys can't grow the map unbounded.
    if (windows.size >= 10_000) {
      for (const [k, w] of windows) {
        if (w.resetAt <= now) windows.delete(k);
      }
    }
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  current.count += 1;
  if (current.count > limit) {
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }
  return { ok: true };
}
