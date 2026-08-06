import { test, expect, type Page } from '@playwright/test'

// The frontend dev server is started by playwright.config.ts with
// VITE_AD_MOCK_TIMEOUT=200 so these ad-gated flows resolve quickly.

async function readState(page: Page) {
  return page.evaluate(() => {
    const s = (window as unknown as { __ZUSTAND_STORE__?: { getState: () => Record<string, unknown> } }).__ZUSTAND_STORE__?.getState()
    return {
      lives: s?.lives as number | undefined,
      isPlaying: s?.isPlaying as boolean | undefined,
      chaosAdUnlocked: s?.chaosAdUnlocked as boolean | undefined,
      scoreMultiplier: s?.scoreMultiplier as number | undefined,
      dailyBonusDate: s?.dailyBonusDate as string | null | undefined,
      options: s?.options as string[] | undefined,
      correct: (s?.currentClue as { correctAnswer?: string } | undefined)?.correctAnswer,
    }
  })
}

async function answerWrong(page: Page) {
  const { options, correct } = await readState(page)
  const wrong = options?.find((o) => o !== correct)
  if (!wrong) throw new Error('No wrong option available')
  await page.getByRole('button', { name: wrong }).click()
  await page.waitForTimeout(700)
}

async function loseAllLives(page: Page) {
  await page.goto('/')
  await page.getByRole('button', { name: 'Endless' }).click()
  await page.waitForTimeout(500)

  for (let i = 0; i < 3; i++) {
    await answerWrong(page)
  }
}

test.describe('ad placements', () => {
  test('revive: watching the ad grants 1 life and resumes the round', async ({ page }) => {
    await loseAllLives(page)

    await expect(page.getByText('Lives Depleted')).toBeVisible()

    await page.getByRole('button', { name: 'Watch Ad to Revive' }).click()
    await expect(page.getByText('Lives Depleted')).not.toBeVisible({ timeout: 5000 })

    const state = await readState(page)
    expect(state.lives).toBe(1)
    expect(state.isPlaying).toBe(true)
  })

  test('revive: giving up ends the game without granting a life', async ({ page }) => {
    await loseAllLives(page)

    await page.getByRole('button', { name: 'Give Up' }).click()

    await expect(page.getByText('GAME OVER')).toBeVisible()
    const state = await readState(page)
    expect(state.lives).toBe(0)
    expect(state.isPlaying).toBe(false)
  })

  test('chaos preview: watching the ad unlocks Chaos Mode', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText('Watch Ad to Try')).toBeVisible()

    await page.getByRole('button', { name: 'Chaos Mode' }).click()
    await expect(page.getByText('Random modifiers. Moving targets. Pure insanity.')).toBeVisible({ timeout: 5000 })

    const state = await readState(page)
    expect(state.chaosAdUnlocked).toBe(true)
  })

  test('daily bonus: claiming grants a 2x multiplier and disables the button', async ({ page }) => {
    await page.goto('/')

    const claimButton = page.getByRole('button', { name: 'Claim' })
    await expect(claimButton).toBeEnabled()

    await claimButton.click()

    await expect(page.getByRole('button', { name: 'Claimed' })).toBeDisabled()
    const state = await readState(page)
    expect(state.scoreMultiplier).toBe(2)
    expect(state.dailyBonusDate).toBe(new Date().toISOString().slice(0, 10))
  })

  test('banner ad: renders on the game-over screen', async ({ page }) => {
    await loseAllLives(page)
    await page.getByRole('button', { name: 'Give Up' }).click()
    await page.waitForTimeout(500)

    await expect(page.getByText('Sponsored')).toBeVisible()
    await expect(page.locator('#banner-ad-container')).toBeVisible()
  })
})
