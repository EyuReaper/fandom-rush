import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import ratingsRouter from './ratings';
import { pool } from '../lib/db';
import { auth } from '../lib/auth';

vi.mock('../lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

describe('Ratings Route API', () => {
  const app = new Hono();
  app.route('/api/ratings', ratingsRouter);

  beforeEach(async () => {
    vi.clearAllMocks();
    await pool.query('TRUNCATE TABLE ratings CASCADE;');
    await pool.query('TRUNCATE TABLE "user" CASCADE;');

    // Insert a dummy user
    await pool.query(`
      INSERT INTO "user" (id, name, email, "emailVerified")
      VALUES ('test-user-1', 'Test User', 'test@example.com', true)
    `);
  });

  it('GET /api/ratings should return aggregate and recent reviews', async () => {
    await pool.query(`
      INSERT INTO ratings (user_id, rating, review_text)
      VALUES ('test-user-1', 4, 'Great game')
    `);

    const res = await app.request('/api/ratings');
    expect(res.status).toBe(200);
    const json = await res.json() as any;
    expect(json.total).toBe(1);
    expect(json.average).toBe('4.0');
    expect(json.recent.length).toBe(1);
    expect(json.recent[0].review_text).toBe('Great game');
  });

  it('POST /api/ratings should create a new rating', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: 'test-user-1' },
    } as any);

    const res = await app.request('/api/ratings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: 5, reviewText: 'Amazing!' }),
    });

    expect(res.status).toBe(200);
    const json = await res.json() as any;
    expect(json.rating).toBe(5);
    expect(json.review_text).toBe('Amazing!');

    const dbRes = await pool.query('SELECT * FROM ratings WHERE user_id = $1', ['test-user-1']);
    expect(dbRes.rows.length).toBe(1);
    expect(dbRes.rows[0].rating).toBe(5);
  });

  it('POST /api/ratings should block profanity', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: 'test-user-1' },
    } as any);

    const res = await app.request('/api/ratings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: 1, reviewText: 'This is bullshit' }),
    });

    expect(res.status).toBe(422);
    const json = await res.json() as any;
    expect(json.error).toBe('Review contains inappropriate language.');
  });
});
