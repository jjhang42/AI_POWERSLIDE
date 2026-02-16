import { vi } from 'vitest';
import React from 'react';

vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_target, prop) => React.forwardRef(({ children, ...props }: any, ref: any) =>
      React.createElement(prop as string, { ...props, ref }, children)
    ),
  }),
  AnimatePresence: ({ children }: any) => children,
}));
