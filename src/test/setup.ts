import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock audioManager to avoid errors in tests
vi.mock('../lib/audioManager', () => ({
  audioManager: {
    init: vi.fn(),
    play: vi.fn(),
    playTick: vi.fn(),
    playBGM: vi.fn(),
    stopBGM: vi.fn(),
    setMute: vi.fn(),
  },
}));

// Mock localStorage
const localStorageStore: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => localStorageStore[key] || null,
  setItem: (key: string, value: string) => { localStorageStore[key] = value.toString(); },
  clear: () => { for (const key in localStorageStore) delete localStorageStore[key]; },
  removeItem: (key: string) => { delete localStorageStore[key]; },
  length: 0,
  key: (index: number) => Object.keys(localStorageStore)[index] || null,
};

globalThis.localStorage = localStorageMock as Storage;
