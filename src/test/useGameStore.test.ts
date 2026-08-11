import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useGameStore, getAccessibleClues, generateOptions } from '../stores/useGameStore';
import { fandomClues } from '../data/fandomClues';
import { getEntitlements } from '../lib/birrjs-client';
import { showRewardedVideo } from '../lib/adManager';

vi.mock('../lib/birrjs-client', () => ({
  getEntitlements: vi.fn(),
}))

vi.mock('../lib/adManager', () => ({
  showRewardedVideo: vi.fn(),
}))

describe('useGameStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useGameStore.getState().resetGame();
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with correct default state', () => {
    const state = useGameStore.getState();
    expect(state.isPlaying).toBe(false);
    expect(state.score).toBe(0);
    expect(state.lives).toBe(3);
    expect(state.combo).toBe(0);
  });

  it('should start the game correctly in endless mode', () => {
    useGameStore.getState().startGame('endless');
    const state = useGameStore.getState();

    expect(state.isPlaying).toBe(true);
    expect(state.gameMode).toBe('endless');
    expect(state.currentClue).not.toBeNull();
    expect(state.options.length).toBe(4);
    expect(state.timeLeft).toBe(8);
  });

  it('should handle correct answer correctly', async () => {
    useGameStore.getState().startGame('endless');
    const stateBefore = useGameStore.getState();
    const correctAnswer = stateBefore.currentClue!.correctAnswer;

    // Set a known time left to test speed bonus (maxTime is 8)
    useGameStore.setState({ timeLeft: 7.5 }); // Elapsed 0.5s -> +30 bonus

    useGameStore.getState().selectAnswer(correctAnswer);

    const stateAfter = useGameStore.getState();
    expect(stateAfter.combo).toBe(1);
    expect(stateAfter.score).toBeGreaterThan(0);
    expect(stateAfter.lives).toBe(3);

    // High score should be updated in the SAME turn as score update if we use the correct state
    expect(stateAfter.highScore).toBe(stateAfter.score);
  });

  it('should handle wrong answer correctly', () => {
    useGameStore.getState().startGame('endless');
    const wrongAnswer = 'Incorrect Fandom Name';

    useGameStore.getState().selectAnswer(wrongAnswer);

    const stateAfter = useGameStore.getState();
    expect(stateAfter.combo).toBe(0);
    expect(stateAfter.lives).toBe(2);
  });

  it('should show the revive prompt when lives reach 0 after nextQuestion is called', () => {
    useGameStore.getState().startGame('endless');

    // Fail 3 times
    useGameStore.getState().selectAnswer('wrong');
    vi.advanceTimersByTime(450); // Advance past nextQuestion timeout

    useGameStore.getState().selectAnswer('wrong');
    vi.advanceTimersByTime(450);

    useGameStore.getState().selectAnswer('wrong');
    vi.advanceTimersByTime(450);

    const state = useGameStore.getState();
    expect(state.lives).toBe(0);
    expect(state.isPlaying).toBe(true);
    expect(state.showRevivePrompt).toBe(true);
  });

  it('should persist high score to localStorage', async () => {
    // Reset everything explicitly
    useGameStore.setState({ highScore: 0, score: 0 });
    localStorage.clear();

    useGameStore.getState().startGame('endless');
    const stateBefore = useGameStore.getState();
    const correctAnswer = stateBefore.currentClue!.correctAnswer;

    useGameStore.getState().selectAnswer(correctAnswer);

    const state = useGameStore.getState();
    expect(state.score).toBeGreaterThan(0);
    expect(state.highScore).toBe(state.score);
    expect(localStorage.getItem('fandomRushHighScore')).toBe(state.score.toString());
  });

  it('should handle sixty-second mode correctly', () => {
    useGameStore.getState().startGame('sixty-second');
    const state = useGameStore.getState();

    expect(state.gameMode).toBe('sixty-second');
    expect(state.timeLeft).toBe(60);
    expect(state.maxTime).toBe(60);

    // Wrong answer in sixty-second mode shouldn't reduce lives
    useGameStore.getState().selectAnswer('wrong');
    expect(useGameStore.getState().lives).toBe(3);
  });

  it('should handle chaos mode modifiers', () => {
    useGameStore.getState().startGame('chaos');
    const state = useGameStore.getState();

    expect(state.gameMode).toBe('chaos');
    expect(state.chaosModifiers.speedMultiplier).toBeGreaterThan(1);
  });
  describe('entitlements & clue filtering', () => {
    beforeEach(() => {
      vi.mocked(getEntitlements).mockResolvedValue([])
    })

    it('fetchEntitlements stores the result', async () => {
      vi.mocked(getEntitlements).mockResolvedValue(['enthusiast', 'fanatic'])

      await useGameStore.getState().fetchEntitlements()
      const state = useGameStore.getState()
      expect(state.entitlements).toEqual(['enthusiast', 'fanatic'])
    })

    it('fetchEntitlements resets to empty on failure', async () => {
      vi.mocked(getEntitlements).mockRejectedValue(new Error('Network error'))
      useGameStore.setState({ entitlements: ['enthusiast'] })

      await useGameStore.getState().fetchEntitlements()
      expect(useGameStore.getState().entitlements).toEqual([])
    })

    it('getAccessibleClues returns 70 free clues for [ ]', () => {
      const clues = getAccessibleClues([])
      expect(clues.length).toBe(70)
      expect(clues.every(c => !c.premium)).toBe(true)
    })

    it('getAccessibleClues returns free + enthusiast for ["enthusiast"]', () => {
      const clues = getAccessibleClues(['enthusiast'])
      const enthusiastCount = fandomClues.filter(c => c.premium === 'enthusiast').length
      expect(clues.length).toBe(70 + enthusiastCount)
    })

    it('getAccessibleClues returns all 166 for ["enthusiast","fanatic"]', () => {
      const clues = getAccessibleClues(['enthusiast', 'fanatic'])
      expect(clues.length).toBe(166)
    })

    it('generateOptions only uses accessible fandoms for free user', () => {
      const allFreeClues = fandomClues.filter(c => !c.premium)
      const freeFandoms = new Set(allFreeClues.map(c => c.fandom))

      const clue = allFreeClues[0]
      const options = generateOptions(clue, [])
      expect(options.every(o => freeFandoms.has(o))).toBe(true)
    })
  })

  describe('ads & monetization edge cases', () => {
    describe('revive', () => {
      beforeEach(() => {
        useGameStore.setState({
          isPlaying: true,
          lives: 0,
          showRevivePrompt: true,
          reviveUsedThisGame: false,
        })
      })

      it('grants 1 life and clears the prompt when the ad completes', async () => {
        vi.mocked(showRewardedVideo).mockResolvedValue(true)

        await useGameStore.getState().revive()

        const state = useGameStore.getState()
        expect(state.lives).toBe(1)
        expect(state.reviveUsedThisGame).toBe(true)
        expect(state.showRevivePrompt).toBe(false)
      })

      it('leaves the prompt open and grants nothing when the ad fails or is skipped', async () => {
        vi.mocked(showRewardedVideo).mockResolvedValue(false)

        await useGameStore.getState().revive()

        const state = useGameStore.getState()
        expect(state.lives).toBe(0)
        expect(state.reviveUsedThisGame).toBe(false)
        expect(state.showRevivePrompt).toBe(true)
      })

      it('does not request another ad once revive has already been used this game', async () => {
        useGameStore.setState({ reviveUsedThisGame: true })

        await useGameStore.getState().revive()

        expect(showRewardedVideo).not.toHaveBeenCalled()
      })
    })

    describe('claimDailyBonus', () => {
      beforeEach(() => {
        useGameStore.setState({ dailyBonusDate: null, scoreMultiplier: 1 })
      })

      it('grants a 2x multiplier on the first claim of the day', () => {
        const today = new Date().toISOString().slice(0, 10)

        const result = useGameStore.getState().claimDailyBonus()

        expect(result).toBe(true)
        const state = useGameStore.getState()
        expect(state.scoreMultiplier).toBe(2)
        expect(state.dailyBonusDate).toBe(today)
        expect(localStorage.getItem('fandomRushDailyBonusDate')).toBe(today)
      })

      it('rejects a second claim on the same day', () => {
        useGameStore.getState().claimDailyBonus()

        const result = useGameStore.getState().claimDailyBonus()

        expect(result).toBe(false)
      })
    })

    describe('unlockChaosPreview', () => {
      beforeEach(() => {
        useGameStore.setState({ chaosAdUnlocked: false })
      })

      it('unlocks chaos mode when the ad completes', async () => {
        vi.mocked(showRewardedVideo).mockResolvedValue(true)

        await useGameStore.getState().unlockChaosPreview()

        expect(useGameStore.getState().chaosAdUnlocked).toBe(true)
        expect(localStorage.getItem('fandomRushChaosAdUnlocked')).toBe('true')
      })

      it('stays locked when the ad fails or is skipped', async () => {
        vi.mocked(showRewardedVideo).mockResolvedValue(false)

        await useGameStore.getState().unlockChaosPreview()

        expect(useGameStore.getState().chaosAdUnlocked).toBe(false)
      })

      it('does not request another ad once already unlocked', async () => {
        useGameStore.setState({ chaosAdUnlocked: true })

        await useGameStore.getState().unlockChaosPreview()

        expect(showRewardedVideo).not.toHaveBeenCalled()
      })
    })
  })

  describe('module initial state resilience to localStorage', () => {
    beforeEach(() => {
      vi.resetModules()
    })

    it('defaults to safe values when localStorage is empty (fresh install / cleared)', async () => {
      localStorage.clear()
      const { useGameStore: freshStore } = await import('../stores/useGameStore')

      const state = freshStore.getState()
      expect(state.highScore).toBe(0)
      expect(state.chaosAdUnlocked).toBe(false)
      expect(state.dailyBonusDate).toBeNull()
    })

    it('falls back to 0 when a stored high score is corrupted (non-numeric)', async () => {
      localStorage.clear()
      localStorage.setItem('fandomRushHighScore', 'not-a-number')
      const { useGameStore: freshStore } = await import('../stores/useGameStore')

      expect(freshStore.getState().highScore).toBe(0)
    })
  })

  describe('empty clue pool', () => {
    beforeEach(() => {
      vi.resetModules()
      vi.doMock('../data/fandomClues', () => ({ fandomClues: [] }))
    })

    afterEach(() => {
      vi.doUnmock('../data/fandomClues')
    })

    it('startGame bails out instead of crashing when no clues are accessible', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const { useGameStore: emptyStore } = await import('../stores/useGameStore')

      emptyStore.getState().startGame('endless')

      const state = emptyStore.getState()
      expect(state.isPlaying).toBe(false)
      expect(state.currentClue).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith('No accessible clues available to start the game.')

      consoleSpy.mockRestore()
    })

    it('generateOptions returns an empty array when there is no current clue', async () => {
      const { generateOptions: generateOptionsEmpty } = await import('../stores/useGameStore')

      expect(generateOptionsEmpty(null, [])).toEqual([])
    })
  })

});
