import { View, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PulseColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface TLDRCardProps {
  text: string;
}

export function TLDRCard({ text }: TLDRCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? PulseColors.dark : PulseColors.light;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.accent} />
      <View style={styles.content}>
        <View style={styles.header}>
          <IconSymbol name="bolt.fill" size={18} color={PulseColors.primary} />
          <ThemedText style={styles.label}>TL;DR</ThemedText>
        </View>
        <ThemedText style={[styles.text, { color: colors.textSecondary }]}>
          {text}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  accent: {
    width: 4,
    backgroundColor: PulseColors.primary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
  },
});
