/**
 * Apple Typography System
 * Based on SF Pro Display / SF Pro Text
 */

export const Typography = {
  // Display - For large, impactful text
  hero: {
    fontSize: '72px',
    lineHeight: '1.05',
    fontWeight: 900,
    letterSpacing: '-0.005em',
  },

  display1: {
    fontSize: '48px',
    lineHeight: '1.1',
    fontWeight: 800,
    letterSpacing: '-0.003em',
  },

  display2: {
    fontSize: '40px',
    lineHeight: '1.1',
    fontWeight: 700,
    letterSpacing: '-0.002em',
  },

  // Titles - For headings
  title1: {
    fontSize: '28px',
    lineHeight: '1.2',
    fontWeight: 700,
    letterSpacing: '0',
  },

  title2: {
    fontSize: '22px',
    lineHeight: '1.3',
    fontWeight: 600,
    letterSpacing: '0',
  },

  title3: {
    fontSize: '20px',
    lineHeight: '1.3',
    fontWeight: 600,
    letterSpacing: '0',
  },

  // Body - For main content
  body: {
    fontSize: '17px',
    lineHeight: '1.5',
    fontWeight: 400,
    letterSpacing: '0',
  },

  bodyEmphasized: {
    fontSize: '17px',
    lineHeight: '1.5',
    fontWeight: 600,
    letterSpacing: '0',
  },

  callout: {
    fontSize: '16px',
    lineHeight: '1.4',
    fontWeight: 400,
    letterSpacing: '0',
  },

  // Small text
  subheadline: {
    fontSize: '15px',
    lineHeight: '1.4',
    fontWeight: 400,
    letterSpacing: '0',
  },

  footnote: {
    fontSize: '13px',
    lineHeight: '1.4',
    fontWeight: 400,
    letterSpacing: '0',
  },

  caption1: {
    fontSize: '12px',
    lineHeight: '1.3',
    fontWeight: 400,
    letterSpacing: '0',
  },

  caption2: {
    fontSize: '11px',
    lineHeight: '1.3',
    fontWeight: 400,
    letterSpacing: '0',
  },
} as const;

// Font weights
export const FontWeights = {
  ultralight: 100,
  thin: 200,
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  heavy: 800,
  black: 900,
} as const;

// Letter spacing values
export const LetterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const;
