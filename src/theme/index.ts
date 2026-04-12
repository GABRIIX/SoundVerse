export const colors = {
  // Backgrounds
  background: '#080808',
  surface: '#111111',
  surfaceVariant: '#191919',
  surfaceElevated: '#202020',
  surfaceModal: '#0C0C0C',

  // Accent — purple
  accent: '#7B2FBE',
  accentLight: '#9D50E0',
  accentDark: '#3D0E78',
  accentContainer: '#2A0B54',

  // Gradient stops for mini-player / highlights
  gradientA: '#1B0545',
  gradientB: '#5B1FA0',
  gradientC: '#8B3FD8',

  // Text
  text: '#FFFFFF',
  textSecondary: '#666666',
  textMuted: '#3A3A3A',
  textInverse: '#000000',

  // UI chrome
  border: '#1E1E1E',
  borderFaint: '#141414',
  divider: '#1A1A1A',
  overlay: 'rgba(0,0,0,0.75)',

  // Semantic
  error: '#CF6679',
  success: '#22C55E',
  warning: '#F59E0B',

  // Platform brand
  spotify: '#1DB954',
  youtube: '#FF0000',
  soundcloud: '#FF5500',
  appleMusic: '#FC3C44',
};

export const gradients = {
  miniPlayer: ['#1B0545', '#5B1FA0', '#8B3FD8'] as const,
  accent: ['#3D0E78', '#7B2FBE'] as const,
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
  // Screen / section titles
  screenTitle: {
    fontSize: 26,
    fontWeight: '900' as const,
    letterSpacing: 1.5,
    color: '#FFFFFF',
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '600' as const,
    letterSpacing: 2,
    color: '#555555',
    textTransform: 'uppercase' as const,
  },

  // Row typography (settings / profile inline rows)
  rowLabel: {
    fontSize: 19,
    fontWeight: '900' as const,
    letterSpacing: 0.5,
    color: '#FFFFFF',
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '400' as const,
    letterSpacing: 0.3,
    color: '#666666',
  },

  // List items
  listTitle: {
    fontSize: 15,
    fontWeight: '900' as const,
    letterSpacing: 1,
    color: '#FFFFFF',
  },
  listSub: {
    fontSize: 11,
    fontWeight: '400' as const,
    letterSpacing: 0.5,
    color: '#555555',
  },

  // Generic
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

export const TAB_BAR_HEIGHT = 62;
export const MINI_PLAYER_HEIGHT = 68;

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
  },
};
