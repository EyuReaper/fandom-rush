import { pool } from './lib/db.js';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import { auth } from './lib/auth.js';
import leaderboardRouter from './routes/leaderboard.js';
import dotenv from 'dotenv';
import dns from 'node:dns';
import telemetryRouter from './routes/telemetry.js';


dns.setDefaultResultOrder('ipv4first');

dotenv.config();

const requiredEnvVars = [
  'DATABASE_URL',
  'BETTER_AUTH_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
] as const;

const missing = requiredEnvVars.filter(v => !process.env[v])
if (missing.length > 0) {
  console.error('Missing required enviroment variables:');
  missing.forEach(v => console.error(` -${v}`));
  console.error('See server/.env.example for defaults.');
  process.exit(1);
}

const app = new Hono();

app.use('*', cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
// Routes
app.route('/api/leaderboard', leaderboardRouter);
// telemetry
app.route('/api/telemetry', telemetryRouter);

// BetterAuth handler
app.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw));

app.get('/', (c) => c.text('Fandom Rush API is running'));

const port = parseInt(process.env.PORT || '3000', 10);
console.log(`Server is running on http://localhost:${port}`);
// Error middleware - catches everything above
app.onError((err, c) => {
  console.error(err);
  return c.json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : err.message,
  }, 500);
})

const shutdown = async (signal: string) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(); //stop accepting new requests
  await pool.end(); // drain all DB connections
  process.exit(0);

};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

const server = serve({
  fetch: app.fetch,
  port,
});
