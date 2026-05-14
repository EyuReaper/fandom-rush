import { create } from "zustand";
import { fandomClues } from "../data/fandomClues";
import type { GameState } from "../types/game";

interface GameStore extends GameState {
  startGame: (mode: "endless" | "sixty-second") => void;
  selectAnswer: (answer: string) => void;
  tickTimer: () => void;
  resetGame: () => void;
  endGame: () => void;
  nextQuestion: () => void;
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
  maxTime: 8,
  highScore: localStorage.getItem("fandomRushHighScore")
    ? parseInt(localStorage.getItem("fandomRushHighScore")!)
    : 0,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  startGame: (mode) => {
    const firstClue = getRandomClue();
    const options = generateOptions(firstClue);

    set({
      isPlaying: true,
      gameMode: mode,
      currentClue: firstClue,
      options,
      score: 0,
      combo: 0,
      lives: 3,
      timeLeft: 8,
    });

    startTimer();
  },

  selectAnswer: (selectedAnswer) => {
    const { currentClue, combo, timeLeft } = get();
    if (!currentClue) return;

    const isCorrect = selectedAnswer === currentClue.correctAnswer;
    const difficultyPoints =
      currentClue.difficulty === "easy"
        ? 10
        : currentClue.difficulty === "medium"
          ? 25
          : 50;

    const speedBonus = timeLeft > 6 ? 30 : timeLeft > 4 ? 20 : 5;

    if (isCorrect) {
      const newCombo = combo + 1;
      const multiplier = 1 + Math.floor(newCombo / 5) * 0.3; // Better progression: x1, x1.3, x1.6...
      const points = Math.floor((difficultyPoints + speedBonus) * multiplier);

      set((state) => ({
        score: state.score + points,
        combo: newCombo,
      }));

      // Update high score in state + localStorage
      const newScore = get().score;
      if (newScore > get().highScore) {
        localStorage.setItem("fandomRushHighScore", newScore.toString());
        set({ highScore: newScore });
      }
    } else {
      set((state) => ({
        lives: Math.max(0, state.lives - 1),
        combo: 0,
      }));
    }

    // Brief pause for feedback then next question
    setTimeout(() => {
      get().nextQuestion();
    }, 420);
  },

  nextQuestion: () => {
    const { lives, gameMode } = get();

    if (lives <= 0 && gameMode === "endless") {
      get().endGame();
      return;
    }

    const nextClue = getRandomClue();
    const newOptions = generateOptions(nextClue);

    set({
      currentClue: nextClue,
      options: newOptions,
      timeLeft: 8,
    });
  },

  tickTimer: () => {
    const { timeLeft, isPlaying } = get();
    if (!isPlaying) return;

    if (timeLeft <= 1) {
      set({ timeLeft: 0 });
      get().selectAnswer(""); // Time out = wrong
    } else {
      set({ timeLeft: timeLeft - 1 });
    }
  },

  endGame: () => {
    set({ isPlaying: false });
  },

  resetGame: () => set(initialState),
}));

// ==================== Helper Functions ====================

function getRandomClue() {
  return fandomClues[Math.floor(Math.random() * fandomClues.length)];
}

function generateOptions(correctClue: any) {
  const correct = correctClue.correctAnswer;
  const others = fandomClues
    .filter((c) => c.correctAnswer !== correct)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map((c) => c.correctAnswer);

  return [...others, correct].sort(() => Math.random() - 0.5);
}

// Timer
let timerInterval: NodeJS.Timeout | null = null;

function startTimer() {
  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    const store = useGameStore.getState();
    if (store.isPlaying) {
      store.tickTimer();
    } else {
      if (timerInterval) clearInterval(timerInterval);
    }
  }, 1000);
}
