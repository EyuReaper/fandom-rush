import { create } from "zustand";
import { fandomClues, type FandomClue } from "../data/fandomClues";
import type { GameState, GameMode } from "../types/game";
import { audioManager } from "../lib/audioManager";
import { getEntitlements } from "../lib/birrjs-client";

interface GameStore extends GameState {
  startGame: (mode: GameMode, category?: string) => void;
  selectAnswer: (answer: string) => void;
  tickTimer: () => void;
  resetGame: () => void;
  endGame: () => void;
  nextQuestion: () => void;
  toggleSwipeMode: () => void;
  toggleMute: () => void;
  entitlements: string[];
  fetchEntitlements: () => Promise<void>;
}

const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

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
  highScore: localStorage.getItem("fandomRushHighScore")
    ? parseInt(localStorage.getItem("fandomRushHighScore")!)
    : 0,
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
  entitlements: []
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  startGame: (mode, category) => {
    audioManager.init();
    const firstClue = getRandomClue(category, []);
    const options = generateOptions(firstClue);

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
      lives: 3,
      timeLeft: mode === "sixty-second" ? 60 : 8,
      maxTime: mode === "sixty-second" ? 60 : 8,
      chaosModifiers,
      previousClueIds: [firstClue.id],
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

    if (isCorrect) {
      audioManager.play('correct', get().isMuted);
      const newCombo = combo + 1;
      const multiplier = 1 + Math.floor(newCombo / 5) * 0.3;
      const points = Math.floor((difficultyPoints + speedBonus) * multiplier);

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
      set((state) => ({
        lives: gameMode === "sixty-second" ? state.lives : Math.max(0, state.lives - 1),
        combo: 0,
      }));
    }

    // Brief pause for feedback then next question
    setTimeout(() => {
      get().nextQuestion();
    }, 420);
  },

  nextQuestion: () => {
    const { lives, gameMode, timeLeft, isPlaying, selectedCategory, previousClueIds } = get();

    if (!isPlaying) return;

    if (lives <= 0 && gameMode !== "sixty-second") {
      get().endGame();
      return;
    }

    if (timeLeft <= 0 && gameMode === "sixty-second") {
      get().endGame();
      return;
    }

    const nextClue = getRandomClue(selectedCategory || undefined, previousClueIds);
    const newOptions = generateOptions(nextClue);

    set((state) => ({
      currentClue: nextClue,
      options: newOptions,
      timeLeft: gameMode === "sixty-second" ? timeLeft : 8,
      previousClueIds: [...state.previousClueIds.slice(-10), nextClue.id],
    }));
  },

  tickTimer: () => {
    const { timeLeft, isPlaying, gameMode, chaosModifiers } = get();
    if (!isPlaying) return;

    if (timeLeft <= 0) {
      if (gameMode !== "sixty-second") {
        get().selectAnswer(""); // Time out = wrong
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
    set({ isPlaying: false });
    audioManager.stopBGM();
    audioManager.play('game-over', get().isMuted);
    if (timerInterval) clearInterval(timerInterval);
  },

  fetchEntitlements: async () => {
    const entitlements = await getEntitlements();
    set({ entitlements });
  },

  resetGame: () => {
    if (timerInterval) clearInterval(timerInterval);
    set({ ...initialState, highScore: get().highScore });
    audioManager.playBGM(get().isMuted);
  }
}));

// ==================== Helper Functions ====================

function getRandomClue(category?: string, previousClueIds: number[] = []) {
  const filtered = category
    ? fandomClues.filter(c => c.category === category)
    : fandomClues;

  // Try to avoid recently used clues
  const available = filtered.filter(c => !previousClueIds.includes(c.id));

  // If we run out of new clues, fallback to any filtered clue
  const source = available.length > 0 ? available : filtered;

  if (source.length === 0) return fandomClues[Math.floor(Math.random() * fandomClues.length)];

  return source[Math.floor(Math.random() * source.length)];
}

function generateOptions(correctClue: FandomClue) {
  const correct = correctClue.correctAnswer;

  // Get all unique fandom names
  const allFandoms = Array.from(new Set(fandomClues.map(c => c.correctAnswer)));

  const others = allFandoms
    .filter((f) => f !== correct)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return [...others, correct].sort(() => Math.random() - 0.5);
}

// Timer
let timerInterval: ReturnType<typeof setInterval> | null = null;

function startTimer() {
  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    const store = useGameStore.getState();
    if (store.isPlaying) {
      store.tickTimer();
    } else {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }
  }, 100); // 100ms for smooth UI
}
