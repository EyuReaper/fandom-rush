import {  type FandomClue } from "../data/fandomClues";

export type GameMode = "endless" | "sixty-second" | "category" | "chaos";

export interface ChaosModifiers {
  speedMultiplier: number;
  movingTargets: boolean;
  invertedControls: boolean;
  blurryClues: boolean;
}

export interface GameState {
  currentClue: FandomClue | null;
  options: string[];
  score: number;
  combo: number;
  lives: number;
  timeLeft: number;
  isPlaying: boolean;
  gameMode: GameMode;
  selectedCategory: string | null;
  maxTime: number;
  highScore: number;
  swipeMode: boolean;
  isMuted: boolean;
  chaosModifiers: ChaosModifiers;
  previousClueIds: number[];
  entitlements: string[];
}

export type GameAction =
  | { type: 'ANSWER'; payload: string }
  | { type: 'NEXT_QUESTION' }
  | { type: 'GAME_OVER' };
