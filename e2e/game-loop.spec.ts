import { test, expect, type Page } from '@playwright/test'

const FAKE_SESSION = {
  session: {
    id: 'sess_e2e',
    userId: 'user_e2e',
    expiresAt: new Date(Date.now() + 86400_000).toISOString(),
    token: 'fake-token',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  user: {
    id: 'user_e2e',
    name: 'E2E Player',
    email: 'e2e@example.com',
    emailVerified: true,
    image: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
}

async function mockSession(page: Page) {
  await page.route('**/api/auth/get-session', async (route) => {
    await route.fulfill({ body: JSON.stringify(FAKE_SESSION), contentType: 'application/json' })
  })
}

async function readState(page: Page) {
  return page.evaluate(() => {
    const s = (window as unknown as { __ZUSTAND_STORE__?: { getState: () => Record<string, unknown> } }).__ZUSTAND_STORE__?.getState()
    return {
      options: s?.options as string[] | undefined,
      correct: (s?.currentClue as { correctAnswer?: string } | undefined)?.correctAnswer,
      isPlaying: s?.isPlaying as boolean | undefined,
      lives: s?.lives as number | undefined,
      score: s?.score as number | undefined,
    }
  })
}

async function answerCorrectly(page: Page) {
  const { correct } = await readState(page)
  if (!correct) throw new Error('No current clue to answer')
  await page.getByRole('button', { name: correct }).click()
  await page.waitForTimeout(700)
}

async function answerWrong(page: Page) {
  const { options, correct } = await readState(page)
  const wrong = options?.find((o) => o !== correct)
  if (!wrong) throw new Error('No wrong option available')
  await page.getByRole('button', { name: wrong }).click()
  await page.waitForTimeout(700)
}

// Drives an Endless round from the main menu all the way to the
// "GAME OVER" screen: one correct answer (so the final score is > 0,
// matching real play) followed by 3 wrong answers to exhaust all
// lives, then dismissing the revive prompt.
async function playToGameOver(page: Page) {
  await page.goto('/')
  await page.getByRole('button', { name: 'Endless' }).click()
  await page.waitForTimeout(500)

  await answerCorrectly(page)

  for (let i = 0; i < 3; i++) {
    await answerWrong(page)
  }

  await page.getByRole('button', { name: 'Give Up' }).click()
  await page.waitForTimeout(500)
}

test.describe('core game loop', () => {
  test('answering correctly increases the score', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Endless' }).click()
    await page.waitForTimeout(500)

    const before = await readState(page)
    expect(before.score).toBe(0)

    await answerCorrectly(page)

    const after = await readState(page)
    expect(after.score).toBeGreaterThan(0)
  })

  test('losing all lives reaches the revive prompt, then GAME OVER', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Endless' }).click()
    await page.waitForTimeout(500)

    await answerWrong(page)
    await answerWrong(page)
    await answerWrong(page)

    await expect(page.getByText('Lives Depleted')).toBeVisible()

    await page.getByRole('button', { name: 'Give Up' }).click()

    await expect(page.getByText('GAME OVER')).toBeVisible()
    const state = await readState(page)
    expect(state.isPlaying).toBe(false)
  })

  test('PLAY AGAIN starts a fresh round after game over', async ({ page }) => {
    await playToGameOver(page)
    await expect(page.getByText('GAME OVER')).toBeVisible()

    await page.getByRole('button', { name: 'PLAY AGAIN' }).click()
    await page.waitForTimeout(500)

    const state = await readState(page)
    expect(state.isPlaying).toBe(true)
    expect(state.lives).toBe(3)
    expect(state.score).toBe(0)
  })

  test('BACK TO TITLE SCREEN returns to the main menu', async ({ page }) => {
    await playToGameOver(page)
    await expect(page.getByText('GAME OVER')).toBeVisible()

    await page.getByRole('button', { name: 'BACK TO TITLE SCREEN' }).click()
    await page.waitForTimeout(500)

    await expect(page.getByRole('button', { name: 'Endless' })).toBeVisible()
  })
})

test.describe('score submission', () => {
  test('submits the final score to the leaderboard for a signed-in player', async ({ page }) => {
    await mockSession(page)

    let submittedBody: unknown = null
    await page.route('**/api/leaderboard', async (route) => {
      if (route.request().method() === 'POST') {
        submittedBody = route.request().postDataJSON()
        await route.fulfill({
          body: JSON.stringify({ id: 1, score: submittedBody, game_mode: 'endless' }),
          contentType: 'application/json',
        })
      } else {
        await route.fulfill({ body: JSON.stringify({ scores: [], userScore: null }), contentType: 'application/json' })
      }
    })

    await playToGameOver(page)

    await expect(page.getByText('Mission Data Uploaded')).toBeVisible()

    expect(submittedBody).not.toBeNull()
    const body = submittedBody as { score: number; gameMode: string; category: string }
    expect(body.score).toBeGreaterThan(0)
    expect(body.gameMode).toBe('endless')
    expect(body.category).toBe('all')
  })

  test('does not submit a score for a signed-out player', async ({ page }) => {
    let postCalled = false
    await page.route('**/api/leaderboard', async (route) => {
      if (route.request().method() === 'POST') postCalled = true
      await route.fulfill({ body: JSON.stringify({ scores: [], userScore: null }), contentType: 'application/json' })
    })

    await playToGameOver(page)
    await page.waitForTimeout(500)

    expect(postCalled).toBe(false)
  })
})

test.describe('leaderboard rendering', () => {
  test('renders scores fetched from the API', async ({ page }) => {
    await mockSession(page)

    const MOCK_SCORES = {
      scores: [
        { user_id: 'user_1', user_name: 'Top Player', user_image: '', score: 9999, game_mode: 'endless', category: 'all', created_at: new Date().toISOString(), pack_ids: '' },
        { user_id: 'user_e2e', user_name: 'E2E Player', user_image: '', score: 100, game_mode: 'endless', category: 'all', created_at: new Date().toISOString(), pack_ids: '' },
      ],
      userScore: null,
    }

    await page.route('**/api/leaderboard*', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ body: JSON.stringify(MOCK_SCORES), contentType: 'application/json' })
      } else {
        await route.fulfill({ body: JSON.stringify({ id: 1 }), contentType: 'application/json' })
      }
    })

    await playToGameOver(page)

    await page.getByText('Global Rankings').click()

    await expect(page.getByText('Top Scores')).toBeVisible()
    await expect(page.getByText('Top Player')).toBeVisible()
    await expect(page.getByText('9,999')).toBeVisible()
  })

  test('shows the empty state when there are no scores', async ({ page }) => {
    await mockSession(page)

    await page.route('**/api/leaderboard*', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ body: JSON.stringify({ scores: [], userScore: null }), contentType: 'application/json' })
      } else {
        await route.fulfill({ body: JSON.stringify({ id: 1 }), contentType: 'application/json' })
      }
    })

    await playToGameOver(page)

    await page.getByText('Global Rankings').click()

    await expect(page.getByText('NO SCORES YET // BE THE FIRST')).toBeVisible()
  })
})
