import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { pool } from '../lib/db.js';
import { auth } from '../lib/auth.js';
import { rateLimiter } from 'hono-rate-limiter';
import { containsProfanity } from '../lib/profanity.js';

const router = new Hono();

const ratingLimiter = rateLimiter({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Too many requests. Slow down.' },
} as any);

const authMiddleware = async (c: any, next: any) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) return c.json({ error: 'Unauthorized' }, 401);
  c.set('session', session);
  await next();
};

const ratingSchema = z.object({
  rating: z.number().int().min(1).max(5),
  reviewText: z.string().max(500).optional(),
});

router.get('/', async (c) => {
  try {
    const [aggregateResult, recentResult] = await Promise.all([
      pool.query(`
        SELECT
          AVG(rating)::numeric(3,1) AS average,
          COUNT(*) AS total
        FROM ratings
      `),
      pool.query(`
        SELECT
          r.rating,
          r.review_text,
          r.created_at,
          u.name AS user_name,
          u.image AS user_image
        FROM ratings r
        JOIN "user" u ON r.user_id = u.id
        WHERE r.review_text IS NOT NULL
        ORDER BY r.created_at DESC
        LIMIT 20
      `),
    ]);

    return c.json({
      average: aggregateResult.rows[0]?.average ?? null,
      total: Number(aggregateResult.rows[0]?.total ?? 0),
      recent: recentResult.rows,
    });
  } catch (err) {
    console.error('Error fetching ratings:', err);
    return c.json({ error: 'Failed to fetch ratings' }, 500);
  }
});

router.get('/user', authMiddleware, async (c: any) => {
  const session = c.get('session');
  try {
    const result = await pool.query(
      'SELECT rating, review_text, created_at FROM ratings WHERE user_id = $1',
      [session.user.id],
    );

    if (result.rows.length === 0) {
      return c.json(null, 404);
    }

    return c.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching user rating:', err);
    return c.json({ error: 'Failed to fetch rating' }, 500);
  }
});

router.post('/', ratingLimiter as any, authMiddleware, zValidator('json', ratingSchema), async (c: any) => {
  const session = c.get('session');
  const { rating, reviewText } = c.req.valid('json');

  if (reviewText && containsProfanity(reviewText)) {
    return c.json({ error: 'Review contains inappropriate language.' }, 422);
  }

  try {
    const result = await pool.query(
      `INSERT INTO ratings (user_id, rating, review_text)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id)
       DO UPDATE SET rating = $2, review_text = $3, updated_at = NOW()
       RETURNING *`,
      [session.user.id, rating, reviewText || null],
    );

    return c.json(result.rows[0]);
  } catch (err) {
    console.error('Error submitting rating:', err);
    return c.json({ error: 'Failed to submit rating' }, 500);
  }
});

export default router;
