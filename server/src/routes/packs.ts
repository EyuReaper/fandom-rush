import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { pool } from '../lib/db.js';
import { auth } from '../lib/auth.js';
import { rateLimiter } from 'hono-rate-limiter';
import { PLANS } from '../lib/birrjs-plans.js';
import { env } from '../lib/env.js';
import { birrjs } from '../lib/birrjs.js';

const router = new Hono();

const authMiddleware = async (c: any, next: any) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) return c.json({ error: 'Unauthorized' }, 401);
  c.set('session', session);
  await next();
};

const webhookSchema = z.object({
  event: z.string(),
  data: z.object({
    subscription_id: z.string(),
    user_id: z.string(),
    pack_id: z.enum(['enthusiast', 'fanatic']),
    status: z.string(),
  }),
});

// GET /api/packs/plans — public plan definitions
router.get('/plans', async (c) => {
  return c.json(PLANS);
});

// GET /api/packs/entitlements — user's purchased packs (auth required)
router.get('/entitlements', authMiddleware, async (c: any) => {
  const session = c.get('session');
  try {
    const result = await pool.query(
      'SELECT pack_id FROM pack_purchases WHERE user_id = $1',
      [session.user.id],
    );
    return c.json(result.rows.map((r: any) => r.pack_id));
  } catch (err) {
    console.error('Error fetching entitlements:', err);
    return c.json({ error: 'Failed to fetch entitlements' }, 500);
  }
});

// POST /api/packs/checkout — initiate BirrJs checkout session
const checkoutSchema = z.object({ packId: z.enum(['enthusiast', 'fanatic']) });
router.post('/checkout', authMiddleware, zValidator('json', checkoutSchema), async (c: any) => {
  const { packId } = c.req.valid('json') as { packId: 'enthusiast' | 'fanatic' };
  const session = c.get('session');
  const plan = PLANS[packId];

  try {
    const checkout = await birrjs.checkout.create({
      priceId: plan.birrjsPriceId,
      userId: session.user.id,
      successUrl: `${env.callbackUrl}/?checkout=success`,
      cancelUrl: `${env.callbackUrl}/?checkout=cancelled`,
    });
    return c.json(checkout);
  } catch (err) {
    console.error('Error creating checkout:', err);
    return c.json({ error: 'Failed to create checkout session' }, 500);
  }
});

// POST /api/packs/webhook — Chapa payment webhook
router.post('/webhook', zValidator('json', webhookSchema), async (c) => {
  const { event, data } = c.req.valid('json');

  if (event !== 'subscription.charge.completed') {
    return c.json({ message: 'Ignored event' });
  }

  try {
    await pool.query(
      `INSERT INTO pack_purchases (user_id, pack_id, birrjs_subscription_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, pack_id)
       DO UPDATE SET birrjs_subscription_id = $3`,
      [data.user_id, data.pack_id, data.subscription_id],
    );
    return c.json({ message: 'Purchase recorded' });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return c.json({ error: 'Webhook processing failed' }, 500);
  }
});

export default router;
