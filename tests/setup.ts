import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => cleanup());

// localStorage mock
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// matchMedia mock
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
});

// document.fonts.ready mock (export에서 사용)
Object.defineProperty(document, 'fonts', {
  value: { ready: Promise.resolve() },
});

// scrollIntoView mock
Element.prototype.scrollIntoView = vi.fn();

// atob/btoa mock (base64ToBlob에서 사용)
global.atob = global.atob || ((str: string) => Buffer.from(str, 'base64').toString('binary'));
global.btoa = global.btoa || ((str: string) => Buffer.from(str, 'binary').toString('base64'));
