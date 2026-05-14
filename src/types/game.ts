import {  type FandomClue } from "../data/fandomClues";

export type GameMode = 'endless' | 'sixty-seconds';

export interface GameState {
  currentClue: FandomClue | null;
  options: string[];
  score: number;
  lives: number;
  timeLeft: number;
  isPlaying: boolean;
  gameMode: GameMode:
  maxTime: number; // 8 seconds default
  highScore: number;

}

export type GameAction =
  | { type: 'ANSWER'; payload: string }
  | { type: 'NEXT_QUESTION' }
  | { type: 'GAME_OVER' };
