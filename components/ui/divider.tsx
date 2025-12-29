import { View, StyleSheet, ViewStyle } from 'react-native';

import { PulseColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface DividerProps {
  style?: ViewStyle;
  spacing?: number;
}

export function Divider({ style, spacing = 0 }: DividerProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? PulseColors.dark : PulseColors.light;

  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: colors.divider,
          marginVertical: spacing,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
});
