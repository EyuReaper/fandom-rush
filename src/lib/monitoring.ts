import * as Sentry from '@sentry/react';

// No-op until VITE_SENTRY_DSN is set — safe to import Sentry.captureException
// elsewhere even when monitoring was never initialized.
export function initMonitoring() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.1,
  });
}

export { Sentry };
