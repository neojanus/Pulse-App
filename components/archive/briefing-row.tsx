import { View, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PulseColors } from '@/constants/theme';
import { PeriodConfig } from '@/constants/categories';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { Briefing } from '@/types/briefing';

interface BriefingRowProps {
  briefing: Briefing;
}

export function BriefingRow({ briefing }: BriefingRowProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? PulseColors.dark : PulseColors.light;
  const periodConfig = PeriodConfig[briefing.period];

  const handlePress = () => {
    router.push(`/briefing/${briefing.id}`);
  };

  // Get the executive summary as preview text
  const previewText = briefing.executiveSummary;

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: colors.surfaceHighlight },
        pressed && { opacity: 0.7 },
      ]}>
      <View style={styles.iconContainer}>
        <IconSymbol
          name={
            briefing.period === 'morning'
              ? 'sun.horizon'
              : briefing.period === 'afternoon'
              ? 'sun.max'
              : 'moon.stars'
          }
          size={18}
          color={periodConfig.color}
        />
      </View>
      <View style={styles.content}>
        <ThemedText
          style={[styles.periodLabel, { color: periodConfig.color }]}>
          {periodConfig.label}
        </ThemedText>
        <ThemedText style={styles.previewText} numberOfLines={2}>
          {previewText}
        </ThemedText>
        <View style={styles.meta}>
          <IconSymbol name="clock" size={12} color={colors.textMuted} />
          <ThemedText style={[styles.metaText, { color: colors.textMuted }]}>
            {briefing.totalReadTimeMinutes} min read
          </ThemedText>
        </View>
      </View>
      <IconSymbol name="chevron.right" size={18} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 10,
    gap: 12,
  },
  iconContainer: {
    paddingTop: 2,
  },
  content: {
    flex: 1,
  },
  periodLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  previewText: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 20,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  metaText: {
    fontSize: 11,
  },
});
