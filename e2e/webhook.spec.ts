import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:3000'

test('records purchase on valid webhook', async ({ page }) => {
  const response = await page.request.post(`${BASE}/api/packs/webhook`, {
    data: {
      event: 'subscription.charge.completed',
      data: {
        subscription_id: `sub_test_${Date.now()}`,
        user_id: 'webhook_test_user',
        pack_id: 'enthusiast',
        status: 'completed',
      },
    },
  })

  expect(response.status()).toBe(200)
  const body = await response.json()
  expect(body.message).toBe('Purchase recorded')
})

test('ignores irrelevant event types', async ({ page }) => {
  const response = await page.request.post(`${BASE}/api/packs/webhook`, {
    data: {
      event: 'subscription.cancelled',
      data: {
        subscription_id: `sub_cancel_${Date.now()}`,
        user_id: 'webhook_test_user',
        pack_id: 'enthusiast',
        status: 'cancelled',
      },
    },
  })

  expect(response.status()).toBe(200)
  const body = await response.json()
  expect(body.message).toBe('Ignored event')
})

test('rejects malformed payload', async ({ page }) => {
  const response = await page.request.post(`${BASE}/api/packs/webhook`, {
    data: {},
  })

  expect(response.status()).toBe(400)
})

test('rejects missing required fields', async ({ page }) => {
  const response = await page.request.post(`${BASE}/api/packs/webhook`, {
    data: {
      event: 'subscription.charge.completed',
      data: { subscription_id: 'sub_1' },
    },
  })

  expect(response.status()).toBe(400)
})

test('handles duplicate webhook idempotently', async ({ page }) => {
  const payload = {
    event: 'subscription.charge.completed',
    data: {
      subscription_id: 'sub_dup_test',
      user_id: 'webhook_dup_user',
      pack_id: 'fanatic',
      status: 'completed',
    },
  }

  const r1 = await page.request.post(`${BASE}/api/packs/webhook`, { data: payload })
  const r2 = await page.request.post(`${BASE}/api/packs/webhook`, { data: payload })

  expect(r1.status()).toBe(200)
  expect(r2.status()).toBe(200)
})
