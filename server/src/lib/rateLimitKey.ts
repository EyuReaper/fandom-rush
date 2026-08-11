import type { Context } from 'hono';

// hono-rate-limiter (0.5.x+) requires an explicit keyGenerator — it no longer
// ships a default. nginx.conf already forwards X-Real-IP / X-Forwarded-For
// from the reverse proxy, so this reads those to key the limit per client IP.
export function ipKeyGenerator(c: Context): string {
  const forwardedFor = c.req.header('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  return c.req.header('x-real-ip') || 'unknown';
}
