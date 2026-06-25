import { Hono, Context, Next } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { pool } from '../lib/db.js';
import { auth } from '../lib/auth.js';
import { rateLimiter } from 'hono-rate-limiter';

const router = new Hono();

const scoreLimiter = rateLimiter({
  windowMs: 60 * 1000, // 60-second window
  max: 10, //max 10 requests per windown
  message: { error: 'To many requests. Slow down.' },

});
// Validation Schemas
const scoreSchema = z.object({
  score: z.number().int().min(0),
  gameMode: z.enum(['endless', 'sixty-second', 'category', 'chaos']),
  category: z.string().min(1).max(50).default('all'),
});

const querySchema = z.object({
  mode: z.enum(['endless', 'sixty-second', 'category', 'chaos']).optional().default('endless'),
  category: z.string().min(1).max(50).optional().default('all'),
});

// Middleware to ensure authentication
const authMiddleware = async (c: Context, next: Next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  c.set('session', session);
  await next();
};

// GET /api/leaderboard?mode=endless&category=all
router.get('/', zValidator('query', querySchema), async (c) => {
  const { mode, category } = c.req.valid('query');
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  try {
    // Query for top 50 unique users' best scores
    const topScoresQuery = `
      WITH UserBestScores AS (
        SELECT
          user_id,
          MAX(score) as score,
          MAX(created_at) as created_at
        FROM scores
        WHERE game_mode = $1 AND (category = $2 OR $2 = 'all')
        GROUP BY user_id
      )
      SELECT
        ubs.score,
        ubs.created_at,
        u.name as user_name,
        u.image as user_image,
        u.id as user_id
      FROM UserBestScores ubs
      JOIN "user" u ON ubs.user_id = u.id
      ORDER BY ubs.score DESC, ubs.created_at ASC
      LIMIT 50
    `;
    const topScoresResult = await pool.query(topScoresQuery, [mode, category]);

    let userScore = null;
    if (session) {
      // Query for the current user's best score and its rank
      const userRankQuery = `
        WITH UserBestScores AS (
          SELECT
            user_id,
            MAX(score) as score,
            MAX(created_at) as created_at
          FROM scores
          WHERE game_mode = $1 AND (category = $2 OR $2 = 'all')
          GROUP BY user_id
        ),
        RankedScores AS (
          SELECT
            user_id,
            score,
            RANK() OVER (ORDER BY score DESC, created_at ASC) as rank
          FROM UserBestScores
        )
        SELECT
          rs.score,
          rs.rank,
          u.name as user_name,
          u.image as user_image,
          u.id as user_id
        FROM RankedScores rs
        JOIN "user" u ON rs.user_id = u.id
        WHERE rs.user_id = $3
      `;
      const userRankResult = await pool.query(userRankQuery, [mode, category, session.user.id]);
      if (userRankResult.rows.length > 0) {
        userScore = userRankResult.rows[0];
      }
    }

    return c.json({
      scores: topScoresResult.rows,
      userScore
    });
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    return c.json({ error: 'Failed to fetch leaderboard' }, 500);
  }
});

// POST /api/scores
router.post('/', scoreLimiter, authMiddleware, zValidator('json', scoreSchema), async (c) => {
  const session = c.get('session');
  const { score, gameMode, category } = c.req.valid('json');

  try {
    const query = `
      INSERT INTO scores (user_id, score, game_mode, category)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await pool.query(query, [
      session.user.id,
      score,
      gameMode,
      category
    ]);
    return c.json(result.rows[0]);
  } catch (err) {
    console.error('Error submitting score:', err);
    return c.json({ error: 'Failed to submit score' }, 500);
  }
});

// POST /api/claim-score
router.post('/claim', scoreLimiter,  authMiddleware, zValidator('json', scoreSchema), async (c) => {
    const session = c.get('session');
    const { score, gameMode, category } = c.req.valid('json');

    try {
      // Check if they already have a better or equal score to avoid duplicates
      const checkQuery = `
        SELECT score FROM scores
        WHERE user_id = $1 AND game_mode = $2 AND category = $3 AND score >= $4
        LIMIT 1
      `;
      const checkResult = await pool.query(checkQuery, [
        session.user.id,
        gameMode,
        category,
        score
      ]);

      if (checkResult.rows.length > 0) {
        return c.json({ message: 'Score already exists or higher score recorded' });
      }

      const query = `
        INSERT INTO scores (user_id, score, game_mode, category)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const result = await pool.query(query, [
        session.user.id,
        score,
        gameMode,
        category
      ]);
      return c.json(result.rows[0]);
    } catch (err) {
      console.error('Error claiming score:', err);
      return c.json({ error: 'Failed to claim score' }, 500);
    }
  });

export default router;
