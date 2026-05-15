import { create } from "zustand";
import { fandomClues, type FandomClue } from "../data/fandomClues";
import type { GameState, GameMode } from "../types/game";

interface GameStore extends GameState {
  startGame: (mode: GameMode, category?: string) => void;
  selectAnswer: (answer: string) => void;
  tickTimer: () => void;
  resetGame: () => void;
  endGame: () => void;
  nextQuestion: () => void;
  toggleSwipeMode: () => void;
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
  swipeMode: isMobile,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  startGame: (mode, category) => {
    const firstClue = getRandomClue(category);
    const options = generateOptions(firstClue);

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
    });

    startTimer();
  },

  toggleSwipeMode: () => set((state) => ({ swipeMode: !state.swipeMode })),

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
    let speedBonus = 0;
    
    if (gameMode !== "sixty-second") {
      if (elapsed < 2) speedBonus = 30;
      else if (elapsed < 3) speedBonus = 20;
      else speedBonus = 5;
    } else {
      speedBonus = 10; // Flat bonus for 60-sec mode
    }

    if (isCorrect) {
      const newCombo = combo + 1;
      const multiplier = 1 + Math.floor(newCombo / 5) * 0.3;
      const points = Math.floor((difficultyPoints + speedBonus) * multiplier);

      set((state) => ({
        score: state.score + points,
        combo: newCombo,
      }));

      const newScore = get().score;
      if (newScore > get().highScore) {
        localStorage.setItem("fandomRushHighScore", newScore.toString());
        set({ highScore: newScore });
      }
    } else {
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
    const { lives, gameMode, timeLeft, isPlaying, selectedCategory } = get();

    if (!isPlaying) return;

    if (lives <= 0 && gameMode !== "sixty-second") {
      get().endGame();
      return;
    }

    if (timeLeft <= 0 && gameMode === "sixty-second") {
      get().endGame();
      return;
    }

    const nextClue = getRandomClue(selectedCategory || undefined);
    const newOptions = generateOptions(nextClue);

    set({
      currentClue: nextClue,
      options: newOptions,
      timeLeft: gameMode === "sixty-second" ? timeLeft : 8,
    });
  },

  tickTimer: () => {
    const { timeLeft, isPlaying, gameMode } = get();
    if (!isPlaying) return;

    if (timeLeft <= 0) {
      if (gameMode !== "sixty-second") {
        get().selectAnswer(""); // Time out = wrong
      } else {
        get().endGame();
      }
    } else {
      // Use 0.1s increments
      set({ timeLeft: Math.max(0, parseFloat((timeLeft - 0.1).toFixed(1))) });
    }
  },

  endGame: () => {
    set({ isPlaying: false });
    if (timerInterval) clearInterval(timerInterval);
  },

  resetGame: () => {
    if (timerInterval) clearInterval(timerInterval);
    set({ ...initialState, highScore: get().highScore });
  }
}));

// ==================== Helper Functions ====================

function getRandomClue(category?: string) {
  const filtered = category 
    ? fandomClues.filter(c => c.category === category)
    : fandomClues;
  
  if (filtered.length === 0) return fandomClues[Math.floor(Math.random() * fandomClues.length)];
  
  return filtered[Math.floor(Math.random() * filtered.length)];
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
