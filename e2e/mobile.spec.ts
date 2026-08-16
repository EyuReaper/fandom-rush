import { test, expect, type Page } from '@playwright/test'

// Mobile-viewport regression tests for the Tier 2 overflow fixes.
// Uses a 375px-wide viewport (iPhone SE / small phones) and asserts that
// key HUD elements stay within the viewport (no clipped content).
test.use({ viewport: { width: 375, height: 667 } })

const FAKE_SESSION = {
  session: {
    id: 'sess_mobile',
    userId: 'user_mobile',
    expiresAt: new Date(Date.now() + 86400_000).toISOString(),
    token: 'fake-token',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  user: {
    id: 'user_mobile',
    name: 'Mobile Player',
    email: 'mobile@example.com',
    emailVerified: true,
    image: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
}

async function mockBackend(page: Page) {
  await page.route('**/api/auth/get-session', async (route) => {
    await route.fulfill({ body: JSON.stringify(FAKE_SESSION), contentType: 'application/json' })
  })
  await page.route('**/api/packs/entitlements*', async (route) => {
    await route.fulfill({ body: JSON.stringify([]), contentType: 'application/json' })
  })
  await page.route('**/api/packs/plans*', async (route) => {
    await route.fulfill({ body: JSON.stringify([]), contentType: 'application/json' })
  })
  await page.route('**/api/leaderboard*', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ body: JSON.stringify({ scores: [], userScore: null }), contentType: 'application/json' })
    } else {
      await route.fulfill({ body: JSON.stringify({ id: 1 }), contentType: 'application/json' })
    }
  })
  await page.route('**/api/ratings*', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({ body: JSON.stringify({ id: 1 }), status: 201, contentType: 'application/json' })
    } else {
      await route.fulfill({ body: JSON.stringify({ average: 0, count: 0, recent: [] }), contentType: 'application/json' })
    }
  })
}

test('main menu renders within the 375px viewport', async ({ page }) => {
  await mockBackend(page)
  await page.goto('/')
  await page.waitForTimeout(800)

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
  expect(overflow).toBe(false)

  const menu = page.locator('main, [class*="min-h-screen"]').first()
  if (await menu.count()) {
    const box = await menu.boundingBox()
    expect(box!.width).toBeLessThanOrEqual(375)
  }
})

test('game HUD does not overflow on mobile', async ({ page }) => {
  await mockBackend(page)
  await page.goto('/')
  await page.waitForTimeout(800)

  await page.getByRole('button', { name: 'Endless' }).click()
  await page.waitForTimeout(600)

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
  expect(overflow).toBe(false)

  const hud = page.getByText('CREDITS').first()
  await expect(hud).toBeVisible()
  const box = await hud.boundingBox()
  expect(box!.x + box!.width).toBeLessThanOrEqual(375)
})

test('category tiles fit on mobile', async ({ page }) => {
  await mockBackend(page)
  await page.goto('/')
  await page.waitForTimeout(800)

  // Open the category picker via the "Category Rush" mode button
  await page.getByRole('button', { name: /category rush/i }).click()
  await page.waitForTimeout(400)

  const tile = page.getByRole('button', { name: /Movies/i })
  await expect(tile).toBeVisible()
  const box = await tile.boundingBox()
  expect(box!.x + box!.width).toBeLessThanOrEqual(375)
})
