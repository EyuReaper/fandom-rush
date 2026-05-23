import { Hono } from 'hono';
import { pool } from '../lib/db.js';
import { auth } from '../lib/auth.js';

const router = new Hono();

// GET /api/leaderboard?mode=endless&category=all
router.get('/', async (c) => {
  const mode = c.req.query('mode') || 'endless';
  const category = c.req.query('category') || 'all';

  try {
    const query = `
      SELECT s.score, s.game_mode, s.category, s.created_at, u.name as user_name, u.image as user_image
      FROM scores s
      JOIN "user" u ON s.user_id = u.id
      WHERE s.game_mode = $1 AND (s.category = $2 OR $2 = 'all')
      ORDER BY s.score DESC
      LIMIT 50
    `;
    const result = await pool.query(query, [mode, category]);
    return c.json(result.rows);
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    return c.json({ error: 'Failed to fetch leaderboard' }, 500);
  }
});

// POST /api/scores
router.post('/', async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  
  if (!session) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const { score, gameMode, category } = await c.req.json();

  if (!score || !gameMode) {
    return c.json({ error: 'Missing required fields' }, 400);
  }

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
      category || 'all'
    ]);
    return c.json(result.rows[0]);
  } catch (err) {
    console.error('Error submitting score:', err);
    return c.json({ error: 'Failed to submit score' }, 500);
  }
});

// POST /api/claim-score
// Used when a user logs in for the first time to sync their local high score
router.post('/claim', async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    
    if (!session) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
  
    const { score, gameMode, category } = await c.req.json();
  
    if (!score || !gameMode) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
  
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
        category || 'all',
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
        category || 'all'
      ]);
      return c.json(result.rows[0]);
    } catch (err) {
      console.error('Error claiming score:', err);
      return c.json({ error: 'Failed to claim score' }, 500);
    }
  });

export default router;
