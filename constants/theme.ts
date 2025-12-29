/**
 * Pulse AI Briefing App - Theme Configuration
 * Design system colors based on UI mockups
 */

import { Platform } from 'react-native';

// Primary brand color
export const PRIMARY = '#2b8cee';

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
