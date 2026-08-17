import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import leaderboardRouter from './leaderboard';
import { pool } from '../lib/db';
import { auth } from '../lib/auth';

vi.mock('../lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

describe('Leaderboard Route API', () => {
  const app = new Hono();
  app.route('/api/leaderboard', leaderboardRouter);

  beforeEach(async () => {
    vi.clearAllMocks();
    await pool.query('TRUNCATE TABLE scores CASCADE;');
    await pool.query('TRUNCATE TABLE "user" CASCADE;');

    // Insert dummy users
    await pool.query(`
      INSERT INTO "user" (id, name, email, "emailVerified")
      VALUES 
      ('test-user-1', 'Test User 1', 'test1@example.com', true),
      ('test-user-2', 'Test User 2', 'test2@example.com', true)
    `);
  });

  it('GET /api/leaderboard should return top scores', async () => {
    await pool.query(`
      INSERT INTO scores (user_id, score, game_mode, category)
      VALUES 
      ('test-user-1', 100, 'endless', 'all'),
      ('test-user-2', 200, 'endless', 'all')
    `);

    vi.mocked(auth.api.getSession).mockResolvedValue(null);

    const res = await app.request('/api/leaderboard?mode=endless&category=all');
    expect(res.status).toBe(200);
    const json = await res.json() as any;
    expect(json.scores.length).toBe(2);
    expect(json.scores[0].score).toBe(200); // Descending order
    expect(json.scores[0].user_name).toBe('Test User 2');
    expect(json.scores[1].score).toBe(100);
    expect(json.userScore).toBeNull();
  });

  it('POST /api/leaderboard should create a new score', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: 'test-user-1' },
    } as any);

    const res = await app.request('/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score: 150, gameMode: 'endless', category: 'all' }),
    });

    expect(res.status).toBe(200);
    const json = await res.json() as any;
    expect(json.score).toBe(150);

    const dbRes = await pool.query('SELECT * FROM scores WHERE user_id = $1', ['test-user-1']);
    expect(dbRes.rows.length).toBe(1);
    expect(dbRes.rows[0].score).toBe(150);
  });
});
