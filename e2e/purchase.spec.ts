import { test, expect } from '@playwright/test'

const MOCK_PLANS = {
  enthusiast: {
    birrjsPriceId: 'price_enthusiast',
    price: 99,
    currency: 'ETB',
    name: 'Enthusiast Pack',
    description: '36 premium clues',
  },
  fanatic: {
    birrjsPriceId: 'price_fanatic',
    price: 249,
    currency: 'ETB',
    name: 'Fanatic Pack',
    description: '60 premium clues + Survival Mode',
  },
}

test.beforeEach(async ({ page }) => {
  await page.route('**/api/packs/plans', async (route) => {
    await route.fulfill({ body: JSON.stringify(MOCK_PLANS) })
  })
})

async function openShop(page: import('@playwright/test').Page) {
  await page.goto('/')
  await page.waitForSelector('[aria-label="Shop"]')
  await page.locator('[aria-label="Shop"]').click()
  await page.waitForSelector('text=Enthusiast Pack')
}

test('renders both pack cards with prices', async ({ page }) => {
  await openShop(page)

  await expect(page.getByRole('heading', { name: 'Enthusiast Pack' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Fanatic Pack' })).toBeVisible()
  await expect(page.getByText('0.99 ETB')).toBeVisible()
  await expect(page.getByText('2.49 ETB')).toBeVisible()
})

test('shows owned badge for purchased packs', async ({ page }) => {
  await openShop(page)

  // Set entitlements directly in the Zustand store
  await page.evaluate(() => {
    const store = (window as any).__ZUSTAND_STORE__
    store?.getState().setEntitlements(['enthusiast'])
  })
  await page.waitForTimeout(300)

  // Entitlement "enthusiast" → Enthusiast card shows "Owned" badge
  await expect(
    page.getByRole('heading', { name: 'Enthusiast Pack' })
      .locator('..')
      .getByText('Owned')
  ).toBeVisible()

  // Only 1 "Unlock Now" button remains (for Fanatic, since Enthusiast is owned)
  const unlockButtons = page.getByRole('button', { name: /Unlock Now/ })
  await expect(unlockButtons).toHaveCount(1)
})

test('clicking Unlock Now calls checkout API', async ({ page }) => {
  let checkoutRequest: any = null
  await page.route('**/api/packs/checkout', async (route) => {
    checkoutRequest = route.request()
    await route.fulfill({ body: JSON.stringify({ url: 'https://checkout.example.com/pay' }) })
  })

  await openShop(page)

  await page.getByRole('button', { name: 'Unlock Now' }).first().click()
  await page.waitForTimeout(1000)

  // Verify the checkout API was called with the correct pack ID
  expect(checkoutRequest).not.toBeNull()
  const postData = checkoutRequest.postDataJSON()
  expect(postData.packId).toBe('enthusiast')
})

test('shows loading state while fetching plans', async ({ page }) => {
  await page.route('**/api/packs/plans', async (route) => {
    await new Promise((r) => setTimeout(r, 500))
    await route.fulfill({ body: JSON.stringify(MOCK_PLANS) })
  })

  await page.goto('/')
  await page.locator('[aria-label="Shop"]').click()

  await expect(page.locator('.animate-spin')).toBeVisible()
})

test('returns 401 for unauthenticated checkout', async ({ page }) => {
  const response = await page.request.post('http://localhost:3000/api/packs/checkout', {
    data: { packId: 'enthusiast' },
  })
  expect(response.status()).toBe(401)
})
