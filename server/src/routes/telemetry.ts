import { Hono } from 'hono';
import { pool } from '../lib/db.js';

const router = new Hono();

const startTime = new Date();
const VERSION = '1.0.0';

router.get('/', async (c) => {
  try {
    const [
      totalPlayersResult,
      totalGamesResult,
      gamesTodayResult,
      gamesThisWeekResult,
      activeUsersResult,
      perModeResult,
      globalStatsResult,
      categoryResult,
      ratingsResult,
    ] = await Promise.all([
      pool.query('SELECT COUNT(DISTINCT user_id) AS count FROM scores'),
      pool.query('SELECT COUNT(*) AS count FROM scores'),
      pool.query('SELECT COUNT(*) AS count FROM scores WHERE created_at >= CURRENT_DATE'),
      pool.query("SELECT COUNT(*) AS count FROM scores WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'"),
      pool.query("SELECT COUNT(DISTINCT user_id) AS count FROM scores WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'"),
      pool.query('SELECT game_mode, COUNT(*) AS count, AVG(score)::int AS avg_score FROM scores GROUP BY game_mode'),
      pool.query('SELECT AVG(score)::int AS global_avg, MAX(score) AS highest FROM scores'),
      pool.query('SELECT category, COUNT(*) AS count FROM scores GROUP BY category ORDER BY count DESC'),
      pool.query('SELECT AVG(rating)::numeric(3,1) AS average, COUNT(*) AS total FROM ratings').catch(() => ({
        rows: [{ average: null, total: 0 }],
      })),
    ]);

    const perMode: Record<string, { count: number; avgScore: number }> = {};
    for (const row of perModeResult.rows) {
      perMode[row.game_mode] = { count: Number(row.count), avgScore: Number(row.avg_score) };
    }

    const perCategory: Record<string, number> = {};
    for (const row of categoryResult.rows) {
      perCategory[row.category] = Number(row.count);
    }

    const uptimeMs = Date.now() - startTime.getTime();

    return c.json({
      totals: {
        totalPlayers: Number(totalPlayersResult.rows[0].count),
        totalGamesPlayed: Number(totalGamesResult.rows[0].count),
        gamesToday: Number(gamesTodayResult.rows[0].count),
        gamesThisWeek: Number(gamesThisWeekResult.rows[0].count),
        activeUsers7d: Number(activeUsersResult.rows[0].count),
      },
      perMode,
      leaderboard: {
        globalAvgScore: Number(globalStatsResult.rows[0].global_avg),
        highestScoreEver: Number(globalStatsResult.rows[0].highest),
      },
      popularity: {
        mostPopularCategory: categoryResult.rows[0]?.category || 'none',
        perCategory,
      },
      ratings: {
        averageRating: ratingsResult.rows[0]?.average ?? null,
        totalRatings: Number(ratingsResult.rows[0]?.total ?? 0),
      },
      server: {
        startTime: startTime.toISOString(),
        uptimeHours: Math.round(uptimeMs / 3600000),
        version: VERSION,
      },
    });
  } catch (err) {
    console.error('Error fetching telemetry:', err);
    return c.json({ error: 'Failed to fetch telemetry' }, 500);
  }
});

export default router;
