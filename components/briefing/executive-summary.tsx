import { View, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PulseColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ExecutiveSummaryProps {
  summary: string;
}

export function ExecutiveSummary({ summary }: ExecutiveSummaryProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? PulseColors.dark : PulseColors.light;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark
            ? `${PulseColors.primary}15`
            : `${PulseColors.primary}08`,
          borderColor: `${PulseColors.primary}30`,
        },
      ]}>
      <View style={styles.header}>
        <IconSymbol name="bolt.fill" size={18} color={PulseColors.primary} />
        <ThemedText style={styles.title}>Executive Summary</ThemedText>
      </View>
      <ThemedText style={[styles.text, { color: colors.textSecondary }]}>
        {summary}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
});
