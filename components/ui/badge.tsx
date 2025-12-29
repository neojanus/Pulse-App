import { View, StyleSheet, ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';

interface BadgeProps {
  label: string;
  color: string;
  backgroundColor: string;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export function Badge({
  label,
  color,
  backgroundColor,
  size = 'sm',
  style,
}: BadgeProps) {
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor,
          paddingHorizontal: isSmall ? 8 : 10,
          paddingVertical: isSmall ? 3 : 4,
        },
        style,
      ]}>
      <ThemedText
        style={[
          styles.label,
          {
            color,
            fontSize: isSmall ? 10 : 11,
          },
        ]}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  label: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
