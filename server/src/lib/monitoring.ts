import * as Sentry from '@sentry/node';

// No-op until SENTRY_DSN is set — safe to call captureException()
// unconditionally elsewhere even when monitoring was never initialized.
export function initMonitoring() {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 0.1,
  });
}

export { Sentry };
