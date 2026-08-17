import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Hono } from 'hono';
import packsRouter from './packs';
import { pool } from '../lib/db';
import { auth } from '../lib/auth';

vi.mock('../lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

describe('Packs Route API', () => {
  const app = new Hono();
  app.route('/api/packs', packsRouter);

  beforeEach(async () => {
    vi.clearAllMocks();
    await pool.query('TRUNCATE TABLE pack_purchases CASCADE;');
    await pool.query('TRUNCATE TABLE "user" CASCADE;');

    // Insert a dummy user
    await pool.query(`
      INSERT INTO "user" (id, name, email, "emailVerified")
      VALUES ('test-user-1', 'Test User', 'test@example.com', true)
    `);
  });

  afterEach(() => {
    delete process.env.TEST_MODE;
  });

  it('GET /api/packs/plans should return all plans', async () => {
    const res = await app.request('/api/packs/plans');
    expect(res.status).toBe(200);
    const json = await res.json() as any;
    expect(json.enthusiast).toBeDefined();
    expect(json.fanatic).toBeDefined();
  });

  it('POST /api/packs/webhook should record a purchase in real DB mode', async () => {
    const res = await app.request('/api/packs/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'subscription.charge.completed',
        data: {
          subscription_id: 'sub-123',
          user_id: 'test-user-1',
          pack_id: 'enthusiast',
          status: 'success'
        }
      }),
    });

    expect(res.status).toBe(200);
    const json = await res.json() as any;
    expect(json.message).toBe('Purchase recorded');

    const dbRes = await pool.query('SELECT * FROM pack_purchases WHERE user_id = $1', ['test-user-1']);
    expect(dbRes.rows.length).toBe(1);
    expect(dbRes.rows[0].pack_id).toBe('enthusiast');
    expect(dbRes.rows[0].birrjs_subscription_id).toBe('sub-123');
  });

  it('GET /api/packs/entitlements should return purchased packs in real DB mode', async () => {
    await pool.query(`
      INSERT INTO pack_purchases (user_id, pack_id, birrjs_subscription_id)
      VALUES ('test-user-1', 'fanatic', 'sub-999')
    `);

    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: 'test-user-1' },
    } as any);

    const res = await app.request('/api/packs/entitlements');
    expect(res.status).toBe(200);
    const json = await res.json() as any;
    expect(json).toContain('fanatic');
    expect(json.length).toBe(1);
  });
});
