export const colors = {
  // Backgrounds
  background: '#0D0D0D',
  surface: '#1A1A1A',
  surfaceVariant: '#252525',
  surfaceElevated: '#2E2E2E',
  surfaceModal: '#161616',

  // Primary / Accent (default — user-configurable at runtime via settingsStore)
  accent: '#7C4DFF',
  accentDim: '#4A2B9B',
  accentContainer: '#1E1040',

  // Text
  text: '#FFFFFF',
  textSecondary: '#9E9E9E',
  textMuted: '#5A5A5A',
  textInverse: '#000000',

  // UI
  border: '#2A2A2A',
  borderFaint: '#1F1F1F',
  divider: '#222222',
  overlay: 'rgba(0,0,0,0.65)',

  // Semantic
  error: '#CF6679',
  success: '#4CAF50',
  warning: '#FF9800',

  // Platform brand colours
  spotify: '#1DB954',
  youtube: '#FF0000',
  soundcloud: '#FF5500',
  appleMusic: '#FC3C44',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  displayLarge: { fontSize: 57, lineHeight: 64, letterSpacing: -0.25, fontWeight: '400' as const },
  displayMedium: { fontSize: 45, lineHeight: 52, letterSpacing: 0, fontWeight: '400' as const },
  headlineLarge: { fontSize: 32, lineHeight: 40, letterSpacing: 0, fontWeight: '700' as const },
  headlineMedium: { fontSize: 28, lineHeight: 36, letterSpacing: 0, fontWeight: '700' as const },
  headlineSmall: { fontSize: 24, lineHeight: 32, letterSpacing: 0, fontWeight: '600' as const },
  titleLarge: { fontSize: 22, lineHeight: 28, letterSpacing: 0, fontWeight: '600' as const },
  titleMedium: { fontSize: 16, lineHeight: 24, letterSpacing: 0.15, fontWeight: '600' as const },
  titleSmall: { fontSize: 14, lineHeight: 20, letterSpacing: 0.1, fontWeight: '600' as const },
  bodyLarge: { fontSize: 16, lineHeight: 24, letterSpacing: 0.15, fontWeight: '400' as const },
  bodyMedium: { fontSize: 14, lineHeight: 20, letterSpacing: 0.25, fontWeight: '400' as const },
  bodySmall: { fontSize: 12, lineHeight: 16, letterSpacing: 0.4, fontWeight: '400' as const },
  labelLarge: { fontSize: 14, lineHeight: 20, letterSpacing: 0.1, fontWeight: '500' as const },
  labelMedium: { fontSize: 12, lineHeight: 16, letterSpacing: 0.5, fontWeight: '500' as const },
  labelSmall: { fontSize: 11, lineHeight: 16, letterSpacing: 0.5, fontWeight: '500' as const },
};

export const TAB_BAR_HEIGHT = 65;
export const MINI_PLAYER_HEIGHT = 72;

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
};
