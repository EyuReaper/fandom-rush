import { create } from "zustand";
import { fandomClues, type FandomClue } from "../data/fandomClues";
import type { GameState, GameMode } from "../types/game";
import { audioManager } from "../lib/audioManager";
import { getEntitlements } from "../lib/birrjs-client";
import { showRewardedVideo } from "../lib/adManager";

interface GameStore extends GameState {
  startGame: (mode: GameMode, category?: string) => void;
  selectAnswer: (answer: string) => void;
  tickTimer: () => void;
  resetGame: () => void;
  endGame: () => void;
  nextQuestion: () => void;
  revive: () => Promise<void>;
  claimDailyBonus: () => boolean;
  unlockChaosPreview: () => Promise<void>;
  toggleSwipeMode: () => void;
  toggleMute: () => void;
  entitlements: string[]; fetchEntitlements: () => Promise<void>; setEntitlements: (ents: string[]) => void; entitlementsError: boolean;
}

const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

function getStoredHighScore(): number {
  const stored = localStorage.getItem("fandomRushHighScore");
  if (!stored) return 0;
  const parsed = parseInt(stored, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

const initialState: GameState = {
  currentClue: null,
  options: [],
  score: 0,
  combo: 0,
  lives: 3,
  timeLeft: 8,
  isPlaying: false,
  gameMode: "endless",
  selectedCategory: null,
  maxTime: 8,
  highScore: getStoredHighScore(),
  swipeMode: localStorage.getItem("fandomRushSwipeMode")
    ? localStorage.getItem("fandomRushSwipeMode") === "true"
    : isMobile,
  isMuted: localStorage.getItem("fandomRushMuted") === "true",
  chaosModifiers: {
    speedMultiplier: 1,
    movingTargets: false,
    invertedControls: false,
    blurryClues: false,
  },
  previousClueIds: [],
  entitlements: [],
  entitlementsError: false,
  bankedScore: 0,
  streak: 0,
  escalationLevel: 1,
  bestBankedScore: 0,
  reviveUsedThisGame: false,
  showRevivePrompt: false,
  timeoutPending: false,
  lastTimeoutAt: 0,
  chaosAdUnlocked: localStorage.getItem("fandomRushChaosAdUnlocked") === "true",
  scoreMultiplier: 1,
  dailyBonusDate: localStorage.getItem("fandomRushDailyBonusDate"),
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  startGame: (mode, category) => {
    const firstClue = getRandomClue(category, [], get().entitlements);
    if (!firstClue) {
      console.error('No accessible clues available to start the game.');
      return;
    }

    audioManager.init();
    const options = generateOptions(firstClue, get().entitlements);

    const isChaos = mode === "chaos";
    const chaosModifiers = {
      speedMultiplier: isChaos ? 1.5 : 1,
      movingTargets: isChaos,
      invertedControls: isChaos && Math.random() > 0.5,
      blurryClues: isChaos && Math.random() > 0.7,
    };

    set({
      isPlaying: true,
      gameMode: mode,
      selectedCategory: category || null,
      currentClue: firstClue,
      options,
      score: 0,
      combo: 0,
      lives: mode === "survival" ? 6 : 3,
      timeLeft: mode === "sixty-second" ? 60 : mode === "survival" ? 8 : 8,
      maxTime: mode === "sixty-second" ? 60 : mode === "survival" ? 8 : 8,
      chaosModifiers,
      previousClueIds: [firstClue.id],
      timeoutPending: false,
      ...(mode === "survival" && {
        bankedScore: 0,
        streak: 0,
        escalationLevel: 1,
        bestBankedScore: 0,
        reviveUsedThisGame: false,
        showRevivePrompt: false,
      }),
    });

    audioManager.stopBGM();
    startTimer();
  },

  toggleSwipeMode: () => {
    const newMode = !get().swipeMode;
    localStorage.setItem("fandomRushSwipeMode", String(newMode));
    set({ swipeMode: newMode });
  },

  toggleMute: () => {
    const newMute = !get().isMuted;
    localStorage.setItem("fandomRushMuted", String(newMute));
    set({ isMuted: newMute });
    audioManager.setMute(newMute);
  },

  selectAnswer: (selectedAnswer) => {
    const { currentClue, combo, timeLeft, gameMode, maxTime } = get();
    if (!currentClue) return;

    const isCorrect = selectedAnswer === currentClue.correctAnswer;
    const difficultyPoints =
      currentClue.difficulty === "easy"
        ? 10
        : currentClue.difficulty === "medium"
          ? 25
          : 50;

    // Speed bonus: Under 2 sec: +30, Under 3 sec: +20
    // timeLeft is remaining, so elapsed = maxTime - timeLeft
    const elapsed = maxTime - timeLeft;
    let speedBonus: number;

    if (gameMode !== "sixty-second") {
      if (elapsed < 2) speedBonus = 30;
      else if (elapsed < 3) speedBonus = 20;
      else speedBonus = 5;
    } else {
      speedBonus = 10; // Flat bonus for 60-sec mode
    }

    const newCombo = combo + 1;
    const multiplier = 1 + Math.floor(newCombo / 5) * 0.3;
    const points = Math.floor((difficultyPoints + speedBonus) * multiplier * get().scoreMultiplier);

    if (isCorrect) {
      // Survival mode: banking + escalation
      if (gameMode === "survival") {
        const newStreak = combo + 1;
        let newBankedScore = get().bankedScore;
        let newEscalation = get().escalationLevel;
        if (newStreak > 0 && newStreak % 5 === 0) {
          newBankedScore = get().score + points;
          if (newBankedScore > get().bestBankedScore) {
            set({ bestBankedScore: newBankedScore });
          }
          if (newStreak % 10 === 0) {
            newEscalation = Math.min(5, newEscalation + 1);
          }
        }
        set({ bankedScore: newBankedScore, escalationLevel: newEscalation, streak: newStreak });
      }

      audioManager.play('correct', get().isMuted);

      set((state) => {
        const newScore = state.score + points;
        const isNewHigh = newScore > state.highScore;

        if (isNewHigh) {
          localStorage.setItem("fandomRushHighScore", newScore.toString());
        }

        return {
          score: newScore,
          combo: newCombo,
          highScore: isNewHigh ? newScore : state.highScore
        };
      });
    } else {
      audioManager.play('wrong', get().isMuted);
      if (gameMode === "survival") {
        set({
          lives: Math.max(0, get().lives - 1),
          combo: 0,
          score: get().bankedScore,
          streak: 0,
        });
      } else {
        set((state) => ({
          lives: gameMode === "sixty-second" ? state.lives : Math.max(0, state.lives - 1),
          combo: 0,
        }));
      }
    }

    // Brief pause for feedback then next question
    setTimeout(() => {
      get().nextQuestion();
    }, 420);
  },

  nextQuestion: () => {
    const { lives, gameMode, timeLeft, isPlaying, selectedCategory, previousClueIds, reviveUsedThisGame, showRevivePrompt } = get();

    if (!isPlaying) return;

    if (showRevivePrompt) return;

    if (lives <= 0 && gameMode !== "sixty-second") {
      if (!reviveUsedThisGame) {
        set({ showRevivePrompt: true });
      } else {
        get().endGame();
      }
      return;
    }

    if (timeLeft <= 0 && gameMode === "sixty-second") {
      get().endGame();
      return;
    }

    const nextClue = getRandomClue(selectedCategory || undefined, previousClueIds, get().entitlements);
    if (!nextClue) {
      get().endGame();
      return;
    }
    const newOptions = generateOptions(nextClue, get().entitlements);

    const survivalTime = gameMode === "survival"
      ? Math.max(3, 8 - (get().escalationLevel - 1))
      : null;

    set((state) => ({
      currentClue: nextClue,
      options: newOptions,
      timeLeft: gameMode === "sixty-second" ? timeLeft : survivalTime ?? 8,
      maxTime: survivalTime ?? state.maxTime,
      previousClueIds: [...state.previousClueIds.slice(-10), nextClue.id],
      timeoutPending: false,
    }));
  },

  tickTimer: () => {
    const { timeLeft, isPlaying, gameMode, chaosModifiers, showRevivePrompt, timeoutPending } = get();
    if (!isPlaying) return;
    if (showRevivePrompt) return;

    if (timeLeft <= 0) {
      if (gameMode !== "sixty-second") {
        if (!timeoutPending) {
          set({ timeoutPending: true, lastTimeoutAt: Date.now() });
          get().selectAnswer(""); // Time out = wrong
        }
      } else {
        get().endGame();
      }
    } else {
      // Use 0.1s increments, modified by speed multiplier
      const decrement = 0.1 * chaosModifiers.speedMultiplier;
      const newTime = Math.max(0, parseFloat((timeLeft - decrement).toFixed(1)));

      // Play tick sound every second of gameplay
      // newTime is like 7.9, 7.8... we want to trigger at 7.0, 6.0 etc.
      const isSecondBoundary = Math.floor(timeLeft) !== Math.floor(newTime);
      if (isSecondBoundary || (newTime <= 3 && Math.floor(newTime * 10) % 5 === 0)) {
        audioManager.playTick(get().isMuted, newTime <= 3);
      }

      set({ timeLeft: newTime });
    }
  },

  endGame: () => {
    set({ isPlaying: false, showRevivePrompt: false });
    audioManager.stopBGM();
    audioManager.play('game-over', get().isMuted);
    stopTimer();
  },

  fetchEntitlements: async () => {
    try {
      const entitlements = await getEntitlements();
      set({ entitlements, entitlementsError: false });
    } catch {
      set({ entitlements: [], entitlementsError: true });
    }
  },

  setEntitlements: (ents: string[]) => set({ entitlements: ents }),

  revive: async () => {
    const { isPlaying, lives, reviveUsedThisGame, showRevivePrompt } = get();
    if (!isPlaying || !showRevivePrompt || lives > 0 || reviveUsedThisGame) return;

    const rewarded = await showRewardedVideo();
    if (rewarded && get().isPlaying && get().showRevivePrompt) {
      set({ lives: 1, reviveUsedThisGame: true, showRevivePrompt: false });
      get().nextQuestion();
    }
  },

  claimDailyBonus: () => {
    const today = new Date().toISOString().slice(0, 10);
    if (get().dailyBonusDate === today) return false;

    localStorage.setItem("fandomRushDailyBonusDate", today);
    set({ dailyBonusDate: today, scoreMultiplier: 2 });
    return true;
  },

  unlockChaosPreview: async () => {
    if (get().chaosAdUnlocked) return;

    const rewarded = await showRewardedVideo();
    if (rewarded) {
      localStorage.setItem("fandomRushChaosAdUnlocked", "true");
      set({ chaosAdUnlocked: true });
    }
  },

  resetGame: () => {
    stopTimer();
    set({
      ...initialState,
      highScore: get().highScore,
      entitlements: get().entitlements,
      chaosAdUnlocked: get().chaosAdUnlocked,
      dailyBonusDate: get().dailyBonusDate,
      bankedScore: 0,
      streak: 0,
      escalationLevel: 1,
      bestBankedScore: 0,
    });
    audioManager.playBGM(get().isMuted);
  }
}));

// ==================== Helper Functions ====================

export function getAccessibleClues(entitlements: string[]) {
  const hasFanatic = entitlements.includes("fanatic");
  const hasEnthusiast = entitlements.includes("enthusiast");
  return fandomClues.filter(c => {
    if (!c.premium) return true;
    if (hasFanatic) return true;
    if (hasEnthusiast && c.premium === "enthusiast") return true;
    return false;
  });
}

function getRandomClue(category?: string, previousClueIds: number[] = [], entitlements: string[] = []): FandomClue | null {
  const accessible = getAccessibleClues(entitlements);
  if (accessible.length === 0) return null;

  const filtered = category
    ? accessible.filter(c => c.category === category)
    : accessible;

  const pool = filtered.length > 0 ? filtered : accessible;
  const available = pool.filter(c => !previousClueIds.includes(c.id));
  const source = available.length > 0 ? available : pool;

  return source[Math.floor(Math.random() * source.length)];
}

export function generateOptions(correctClue: FandomClue | null, entitlements: string[] = []): string[] {
  if (!correctClue) return [];

  const correct = correctClue.correctAnswer;
  const accessible = getAccessibleClues(entitlements);
  const allFandoms = Array.from(new Set(accessible.map(c => c.correctAnswer)));

  const others = allFandoms
    .filter((f) => f !== correct)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return [...others, correct].sort(() => Math.random() - 0.5);
}

// Timer
// `timerInterval` is owned exclusively by startTimer/stopTimer — no other
// code should read or clear it directly, so there's a single source of
// truth for whether a timer is currently running.
let timerInterval: ReturnType<typeof setInterval> | null = null;

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function startTimer() {
  stopTimer();

  timerInterval = setInterval(() => {
    const store = useGameStore.getState();
    if (store.isPlaying) {
      store.tickTimer();
    } else {
      stopTimer();
    }
  }, 100);
}

// Expose store for e2e tests
if (typeof window !== 'undefined') {
  (window as unknown as { __ZUSTAND_STORE__?: typeof useGameStore }).__ZUSTAND_STORE__ = useGameStore;
}
