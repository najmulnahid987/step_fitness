/**
 * Centralized Design Tokens and Theme System
 * Fitness Activity Application
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Palette = {
  primary: '#0B756C',
  primaryPressed: '#075E58',
  primarySubtle: '#E4F1EF',
  aqua: '#8BD6D0',
  mutedYellow: '#EACB73',
  background: '#F5F7F6',
  surface: '#FFFFFF',
  mutedSurface: '#EDF2F0',
  mainText: '#1F2C2A',
  secondaryText: '#63716E',
  tertiaryText: '#87928F',
  border: '#E0E8E5',
  borderFocused: '#0B756C',
  success: '#2F8066',
  warning: '#A9781D',
  error: '#B84C4C',
  errorSubtle: '#FBEBEB',
  disabledBackground: '#EAEFEF',
  disabledText: '#A1ADA9',
  white: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.45)',
} as const;

export type PaletteColor = keyof typeof Palette;

export const Colors = {
  light: {
    text: Palette.mainText,
    background: Palette.background,
    backgroundElement: Palette.mutedSurface,
    backgroundSelected: Palette.primarySubtle,
    textSecondary: Palette.secondaryText,
    primary: Palette.primary,
    surface: Palette.surface,
    border: Palette.border,
    error: Palette.error,
    success: Palette.success,
  },
  dark: {
    text: '#FFFFFF',
    background: '#121716',
    backgroundElement: '#1B2422',
    backgroundSelected: '#0B756C',
    textSecondary: '#A0ABA8',
    primary: '#8BD6D0',
    surface: '#1B2422',
    border: '#2C3836',
    error: '#E07171',
    success: '#4EAA8E',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  // Legacy alias support
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,

  // Standard Spacing Scale (4, 8, 12, 16, 20, 24, 32, 40, 48)
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
} as const;

export type SpacingKey = keyof typeof Spacing;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  max: 24,
  full: 9999,
} as const;

export type BorderRadiusKey = keyof typeof BorderRadius;

export const Typography = {
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
  },
  supporting: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  bodyEmphasis: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600' as const,
  },
  smallHeading: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600' as const,
  },
  sectionHeading: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700' as const,
  },
  largeHeading: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700' as const,
  },
  display: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700' as const,
  },
} as const;

export type TypographyVariant = keyof typeof Typography;

export const BorderWidth = {
  thin: 1,
  medium: 2,
} as const;

export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  subtle: {
    shadowColor: Palette.mainText,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  card: {
    shadowColor: Palette.mainText,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
} as const;

export const TouchTarget = {
  min: 44,
} as const;

export const IconSize = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
