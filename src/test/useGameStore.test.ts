import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useGameStore } from '../stores/useGameStore';

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

  it('should end the game when lives reach 0 after nextQuestion is called', () => {
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
    expect(state.isPlaying).toBe(false);
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
});
