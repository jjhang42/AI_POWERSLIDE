/**
 * Apple Human Interface Guidelines - System Colors
 * Based on iOS 13+ / macOS Big Sur+
 */

export const AppleColors = {
  // System Colors (Light Mode)
  blue: {
    light: '#007AFF',
    dark: '#0A84FF',
  },
  green: {
    light: '#34C759',
    dark: '#30D158',
  },
  indigo: {
    light: '#5856D6',
    dark: '#5E5CE6',
  },
  orange: {
    light: '#FF9500',
    dark: '#FF9F0A',
  },
  pink: {
    light: '#FF2D55',
    dark: '#FF375F',
  },
  purple: {
    light: '#AF52DE',
    dark: '#BF5AF2',
  },
  red: {
    light: '#FF3B30',
    dark: '#FF453A',
  },
  teal: {
    light: '#5AC8FA',
    dark: '#64D2FF',
  },
  yellow: {
    light: '#FFCC00',
    dark: '#FFD60A',
  },

  // Gray Scale
  gray: {
    1: '#F2F2F7',
    2: '#E5E5EA',
    3: '#D1D1D6',
    4: '#C7C7CC',
    5: '#AEAEB2',
    6: '#8E8E93',
  },

  // Semantic Colors
  label: {
    primary: 'rgba(0, 0, 0, 0.85)',
    secondary: 'rgba(0, 0, 0, 0.55)',
    tertiary: 'rgba(0, 0, 0, 0.30)',
    quaternary: 'rgba(0, 0, 0, 0.15)',
  },

  fill: {
    primary: 'rgba(120, 120, 128, 0.20)',
    secondary: 'rgba(120, 120, 128, 0.16)',
    tertiary: 'rgba(118, 118, 128, 0.12)',
    quaternary: 'rgba(116, 116, 128, 0.08)',
  },

  separator: {
    opaque: 'rgba(198, 198, 200, 1)',
    nonOpaque: 'rgba(60, 60, 67, 0.29)',
  },
} as const;

// Dark mode colors
export const AppleColorsDark = {
  label: {
    primary: 'rgba(255, 255, 255, 0.85)',
    secondary: 'rgba(235, 235, 245, 0.60)',
    tertiary: 'rgba(235, 235, 245, 0.30)',
    quaternary: 'rgba(235, 235, 245, 0.18)',
  },

  fill: {
    primary: 'rgba(120, 120, 128, 0.36)',
    secondary: 'rgba(120, 120, 128, 0.32)',
    tertiary: 'rgba(118, 118, 128, 0.24)',
    quaternary: 'rgba(116, 116, 128, 0.18)',
  },

  separator: {
    opaque: 'rgba(56, 56, 58, 1)',
    nonOpaque: 'rgba(84, 84, 88, 0.65)',
  },
} as const;
