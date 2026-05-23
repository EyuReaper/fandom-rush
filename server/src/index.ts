import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import { auth } from './lib/auth.js';
import leaderboardRouter from './routes/leaderboard.js';
import dotenv from 'dotenv';

dotenv.config();

const app = new Hono();

app.use('*', cors({
  origin: 'http://localhost:5173',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Routes
app.route('/api/leaderboard', leaderboardRouter);

// BetterAuth handler
app.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw));

app.get('/', (c) => c.text('Fandom Rush API is running'));

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
