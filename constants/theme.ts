/**
 * Pulse AI Briefing App - Theme Configuration
 * Design system colors based on UI mockups
 */

import { Platform, ViewStyle } from 'react-native';

// Primary brand color
export const PRIMARY = '#2b8cee';

// ============================================================================
// DESIGN TOKENS - Standardized scales for consistency
// ============================================================================

/**
 * Spacing scale (in pixels)
 * Use these for margins, paddings, and gaps
 */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

/**
 * Border radius scale
 * Consistent rounded corners throughout the app
 */
export const BorderRadius = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const;

/**
 * Typography scale
 * Font sizes with corresponding line heights
 */
export const Typography = {
  xs: { fontSize: 10, lineHeight: 14 },
  sm: { fontSize: 12, lineHeight: 16 },
  base: { fontSize: 14, lineHeight: 20 },
  md: { fontSize: 15, lineHeight: 22 },
  lg: { fontSize: 16, lineHeight: 24 },
  xl: { fontSize: 18, lineHeight: 26 },
  '2xl': { fontSize: 20, lineHeight: 28 },
  '3xl': { fontSize: 24, lineHeight: 32 },
  '4xl': { fontSize: 28, lineHeight: 36 },
  '5xl': { fontSize: 32, lineHeight: 40 },
  '6xl': { fontSize: 36, lineHeight: 44 },
  '7xl': { fontSize: 42, lineHeight: 48 },
} as const;

/**
 * Font weights for consistent typography
 */
export const FontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

/**
 * Shadow presets for elevation
 * Use these for cards, buttons, and floating elements
 */
export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  } as ViewStyle,
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  } as ViewStyle,
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  } as ViewStyle,
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  } as ViewStyle,
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  } as ViewStyle,
  /** Creates a colored glow effect - great for primary buttons */
  glow: (color: string, intensity: number = 0.3): ViewStyle => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: intensity,
    shadowRadius: 12,
    elevation: 0,
  }),
  /** Inner-like shadow effect using opacity */
  inner: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 1,
    elevation: 0,
  } as ViewStyle,
};

/**
 * Opacity scale for transparent overlays and disabled states
 */
export const Opacity = {
  subtle: 0.05,
  light: 0.1,
  medium: 0.15,
  strong: 0.2,
  stronger: 0.3,
  half: 0.5,
  muted: 0.6,
  high: 0.8,
  full: 1,
} as const;

/**
 * Animation durations (in ms)
 */
export const Duration = {
  instant: 0,
  fast: 100,
  normal: 200,
  slow: 300,
  slower: 400,
  slowest: 600,
} as const;

/**
 * Z-index scale for layering
 */
export const ZIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  modal: 30,
  popover: 40,
  toast: 50,
} as const;

// Legacy colors (for backwards compatibility with existing components)
const tintColorLight = PRIMARY;
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#f6f7f8',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#101922',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

// Pulse Design System Colors
export const PulseColors = {
  primary: PRIMARY,
  primaryHover: '#2580d9',
  primaryLight: 'rgba(43, 140, 238, 0.1)',
  primaryShadow: 'rgba(43, 140, 238, 0.2)',

  light: {
    background: '#f6f7f8',
    surface: '#ffffff',
    surfaceHighlight: '#f0f0f0',
    text: '#11181C',
    textSecondary: '#687076',
    textMuted: '#94a3b8',
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    divider: '#e2e8f0',
  },

  dark: {
    background: '#101922',
    surface: '#1a2332',
    surfaceHighlight: '#233345',
    text: '#ECEDEE',
    textSecondary: '#92adc9',
    textMuted: '#64748b',
    border: '#324d67',
    borderLight: '#1e293b',
    divider: '#334155',
  },
};

// Semantic colors
export const SemanticColors = {
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
