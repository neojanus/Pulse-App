import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Card } from '@/components/ui/card';
import { AnimatedPressable } from '@/components/ui/animated-pressable';
import { BriefingItemPreview } from './briefing-item-preview';
import { PulseColors } from '@/constants/theme';
import { PeriodConfig } from '@/constants/categories';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { Briefing } from '@/types/briefing';

interface BriefingCardProps {
  briefing: Briefing;
}

export function BriefingCard({ briefing }: BriefingCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? PulseColors.dark : PulseColors.light;
  const periodConfig = PeriodConfig[briefing.period];

  const handlePress = () => {
    router.push(`/briefing/${briefing.id}`);
  };

  // Show top 3 items
  const previewItems = briefing.items.slice(0, 3);

  if (!briefing.isAvailable) {
    return (
      <Card variant="outlined" style={styles.card}>
        <View style={styles.lockedContainer}>
          <View style={styles.periodHeader}>
            <View
              style={[
                styles.periodIcon,
                { backgroundColor: `${periodConfig.color}20` },
              ]}>
              <IconSymbol
                name={
                  briefing.period === 'morning'
                    ? 'sun.horizon'
                    : briefing.period === 'afternoon'
                    ? 'sun.max'
                    : 'moon.stars'
                }
                size={20}
                color={periodConfig.color}
              />
            </View>
            <View>
              <ThemedText style={[styles.periodLabel, { color: periodConfig.color }]}>
                {periodConfig.label}
              </ThemedText>
              <ThemedText style={[styles.timeLabel, { color: colors.textMuted }]}>
                Available at {periodConfig.time}
              </ThemedText>
            </View>
          </View>
          <IconSymbol name="clock" size={20} color={colors.textMuted} />
        </View>
      </Card>
    );
  }

  return (
    <Card variant="elevated" style={styles.card}>
      {/* Header */}
      <View
        style={[
          styles.headerGradient,
          { backgroundColor: `${periodConfig.color}15` },
        ]}>
        <View style={styles.periodHeader}>
          <View
            style={[
              styles.periodIcon,
              { backgroundColor: `${periodConfig.color}30` },
            ]}>
            <IconSymbol
              name={
                briefing.period === 'morning'
                  ? 'sun.horizon'
                  : briefing.period === 'afternoon'
                  ? 'sun.max'
                  : 'moon.stars'
              }
              size={20}
              color={periodConfig.color}
            />
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText style={[styles.periodLabel, { color: periodConfig.color }]}>
              {periodConfig.label}
            </ThemedText>
            <ThemedText style={[styles.itemCount, { color: colors.textSecondary }]}>
              {briefing.items.length} items · {briefing.totalReadTimeMinutes} min
            </ThemedText>
          </View>
          {briefing.isRead && (
            <View style={styles.readBadge}>
              <IconSymbol name="checkmark" size={12} color={PulseColors.primary} />
            </View>
          )}
        </View>
      </View>

      {/* Preview Items */}
      <View style={styles.previewList}>
        {previewItems.map((item, index) => (
          <BriefingItemPreview
            key={item.id}
            item={item}
            isLast={index === previewItems.length - 1}
          />
        ))}
      </View>

      {/* CTA Button */}
      <AnimatedPressable
        onPress={handlePress}
        style={[styles.ctaButton, { backgroundColor: PulseColors.primary }]}>
        <ThemedText style={styles.ctaText}>
          Read {periodConfig.label} Brief
        </ThemedText>
        <IconSymbol name="arrow.right" size={16} color="#fff" />
      </AnimatedPressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  lockedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    opacity: 0.6,
  },
  headerGradient: {
    padding: 16,
    paddingBottom: 12,
  },
  periodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  periodIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodLabel: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timeLabel: {
    fontSize: 13,
    marginTop: 2,
  },
  itemCount: {
    fontSize: 13,
    marginTop: 2,
  },
  readBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: PulseColors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewList: {
    paddingHorizontal: 16,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    margin: 16,
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  ctaText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
