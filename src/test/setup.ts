import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { createElement, Fragment } from 'react';

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

/* eslint-disable @typescript-eslint/no-explicit-any */
// Mock framer-motion to render children without animation
vi.mock('framer-motion', () => {
  function c(tag: string | typeof Fragment, props: any, ...children: any[]) {
    return createElement(tag, props, ...children);
  }
  function makeMotion(tag: string) {
    return (props: any) => {
      const { children, ...rest } = props;
      return c(tag, rest, ...(Array.isArray(children) ? children : [children]).filter(Boolean));
    };
  }
  return {
    motion: {
      div: makeMotion('div'),
      button: makeMotion('button'),
      span: makeMotion('span'),
      img: makeMotion('img'),
      p: makeMotion('p'),
      h1: makeMotion('h1'),
      h2: makeMotion('h2'),
      h3: makeMotion('h3'),
    },
    AnimatePresence: ({ children }: any) => children,
    useMotionValue: (val: any) => ({ get: () => val, set: vi.fn(), onChange: vi.fn() }),
    useTransform: () => '',
    useDragControls: () => ({}),
  };
});
/* eslint-enable @typescript-eslint/no-explicit-any */

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
