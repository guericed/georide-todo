/**
 * Color Palette
 * Centralized color definitions for the app's design system
 */

export const colors = {
  // Brand Colors
  brand: {
    primary: '#3B82F6',      // Main blue
    primaryDark: '#2563EB',  // Darker blue
    primaryLight: '#DBEAFE', // Light blue
    primaryPale: '#93C5FD',  // Pale blue (disabled states)
  },

  // Neutral Colors
  neutral: {
    white: '#FFFFFF',
    black: '#111827',
    gray50: '#F9FAFB',   // Background
    gray100: '#E5E7EB',  // Borders, secondary buttons
    gray200: '#D1D5DB',  // Input borders
    gray400: '#9CA3AF',  // Placeholder text
    gray500: '#6B7280',  // Secondary text
    gray600: '#374151',  // Primary text
  },

  // Semantic Colors
  error: {
    main: '#EF4444',       // Error text/icons
    dark: '#B91C1C',       // Error banner text
    light: '#FEF2F2',      // Error banner background
    border: '#FECACA',     // Error banner border
  },

  // Shadow
  shadow: '#000',
} as const;

/**
 * Semantic color aliases for easier usage
 */
export const semanticColors = {
  background: colors.neutral.gray50,
  surface: colors.neutral.white,
  text: {
    primary: colors.neutral.black,
    secondary: colors.neutral.gray600,
    tertiary: colors.neutral.gray500,
    disabled: colors.neutral.gray400,
    inverse: colors.neutral.white,
  },
  border: {
    default: colors.neutral.gray200,
    light: colors.neutral.gray100,
  },
} as const;
