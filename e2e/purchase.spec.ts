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
  return page.getByRole('dialog')
}

test('renders both pack cards with prices', async ({ page }) => {
  const dialog = await openShop(page)

  await expect(dialog.getByRole('heading', { name: 'Enthusiast Pack' })).toBeVisible()
  await expect(dialog.getByRole('heading', { name: 'Fanatic Pack' })).toBeVisible()
  await expect(dialog.getByText('99 birr')).toBeVisible()
  await expect(dialog.getByText('249 birr')).toBeVisible()
})

test('shows owned badge for purchased packs', async ({ page }) => {
  const dialog = await openShop(page)

  // Set entitlements directly in the Zustand store
  await page.evaluate(() => {
    const store = (window as unknown as { __ZUSTAND_STORE__?: { getState: () => { setEntitlements: (ents: string[]) => void } } }).__ZUSTAND_STORE__
    store?.getState().setEntitlements(['enthusiast'])
  })
  await page.waitForTimeout(300)

  // Entitlement "enthusiast" → Enthusiast card shows a "CLEARED" owned indicator
  await expect(
    dialog.getByRole('heading', { name: 'Enthusiast Pack' })
      .locator('..')
      .getByRole('button', { name: 'CLEARED' })
  ).toBeVisible()

  // Only 1 "INSERT COIN" button remains (for Fanatic, since Enthusiast is owned)
  const unlockButtons = dialog.getByRole('button', { name: /INSERT COIN/ })
  await expect(unlockButtons).toHaveCount(1)
})

test('clicking INSERT COIN calls checkout API', async ({ page }) => {
  let checkoutRequest: import('@playwright/test').Request | null = null
  await page.route('**/api/packs/checkout', async (route) => {
    checkoutRequest = route.request()
    await route.fulfill({ body: JSON.stringify({ url: 'https://checkout.example.com/pay' }) })
  })

  const dialog = await openShop(page)

  await dialog.getByRole('button', { name: 'INSERT COIN' }).first().click()
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
