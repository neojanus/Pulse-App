import { View, StyleSheet, ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing, Typography } from '@/constants/theme';

interface BadgeProps {
  label: string;
  color: string;
  backgroundColor: string;
  size?: 'sm' | 'md' | 'lg';
  /** Show subtle border matching the text color */
  bordered?: boolean;
  /** Make the badge pill-shaped */
  pill?: boolean;
  style?: ViewStyle;
}

/**
 * Badge - Category and status indicator with refined styling
 *
 * Features:
 * - Subtle border treatment (20% opacity of text color)
 * - Multiple sizes
 * - Pill shape option
 */
export function Badge({
  label,
  color,
  backgroundColor,
  size = 'sm',
  bordered = true,
  pill = false,
  style,
}: BadgeProps) {
  // Size configurations
  const sizeConfig = {
    sm: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: 3,
      fontSize: Typography.xs.fontSize,
      borderRadius: pill ? BorderRadius.full : BorderRadius.sm,
    },
    md: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
      fontSize: Typography.sm.fontSize - 1, // 11px
      borderRadius: pill ? BorderRadius.full : BorderRadius.md,
    },
    lg: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.sm,
      fontSize: Typography.sm.fontSize,
      borderRadius: pill ? BorderRadius.full : BorderRadius.lg,
    },
  };

  const config = sizeConfig[size];

  // Create subtle border color (20% opacity of text color)
  // This matches the mockup style: border-primary/20
  const borderColor = bordered ? `${color}33` : 'transparent'; // 33 = ~20% hex opacity

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor,
          paddingHorizontal: config.paddingHorizontal,
          paddingVertical: config.paddingVertical,
          borderRadius: config.borderRadius,
          borderWidth: bordered ? 1 : 0,
          borderColor,
        },
        style,
      ]}>
      <ThemedText
        style={[
          styles.label,
          {
            color,
            fontSize: config.fontSize,
          },
        ]}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
  },
  label: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
