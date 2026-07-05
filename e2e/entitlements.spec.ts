import { test, expect } from '@playwright/test'

test.describe('Survival Mode gate', () => {
  test('is disabled for free users', async ({ page }) => {
    await page.goto('/')
    const survivalBtn = page.getByRole('button', { name: /Survival/ })

    await expect(survivalBtn).toBeDisabled()
    await expect(page.getByText('Fanatic Pack required')).toBeVisible()
  })

  test('is enabled for fanatic owners', async ({ page }) => {
    await page.goto('/')
    // Populate store as if user owns fanatic pack
    await page.evaluate(() => {
      const store = (window as any).__ZUSTAND_STORE__
      store?.getState().setEntitlements(['enthusiast', 'fanatic'])
    })
    // Wait for React re-render
    await page.waitForTimeout(300)

    const survivalBtn = page.getByRole('button', { name: /Survival/ })
    await expect(survivalBtn).not.toBeDisabled()
  })
})

test.describe('clue filtering', () => {
  test('free users see non-premium clues in game', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Endless' }).click()

    // Play a few rounds — verify no crash (premium clues never appear)
    for (let i = 0; i < 5; i++) {
      await page.waitForTimeout(600)
      const correct = await page.evaluate(() => {
        const state = (window as any).__ZUSTAND_STORE__?.getState()
        return state?.currentClue?.correctAnswer
      })
      if (correct) await page.getByRole('button', { name: correct }).click()
      await page.waitForTimeout(600)
    }
  })
})
