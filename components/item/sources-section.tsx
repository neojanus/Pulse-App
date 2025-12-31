import { View, StyleSheet, Linking, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AnimatedPressable } from '@/components/ui/animated-pressable';
import { PulseColors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { BriefingSource } from '@/types/briefing';

interface SourcesSectionProps {
  sources: BriefingSource[];
}

export function SourcesSection({ sources }: SourcesSectionProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? PulseColors.dark : PulseColors.light;

  const handleSourcePress = (url: string) => {
    // Haptic feedback when opening external link
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Linking.openURL(url);
  };

  const getSourceIcon = (type?: string) => {
    switch (type) {
      case 'paper':
        return 'doc.text';
      case 'repository':
        return 'chevron.left.forwardslash.chevron.right';
      default:
        return 'globe';
    }
  };

  const getSourceTypeLabel = (type?: string) => {
    switch (type) {
      case 'paper':
        return 'PDF';
      case 'repository':
        return 'Repository';
      case 'article':
        return 'Article';
      case 'blog':
        return 'Blog';
      default:
        return 'Link';
    }
  };

  // Get icon color based on source type
  const getIconColor = (type?: string) => {
    switch (type) {
      case 'paper':
        return '#ef4444'; // red
      case 'repository':
        return '#8b5cf6'; // purple
      case 'blog':
        return '#f97316'; // orange
      case 'article':
        return '#3b82f6'; // blue
      default:
        return PulseColors.primary;
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText style={[styles.title, { color: colors.textMuted }]}>
        Sources
      </ThemedText>
      <View style={styles.list}>
        {sources.map((source) => {
          const iconColor = getIconColor(source.type);

          return (
            <AnimatedPressable
              key={source.id}
              onPress={() => handleSourcePress(source.url)}
              haptic="light"
              scaleValue={0.98}
              style={[
                styles.sourceCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: `${colors.border}80`,
                },
              ]}>
              <View style={styles.sourceContent}>
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor: `${iconColor}15`,
                      borderWidth: 1,
                      borderColor: `${iconColor}25`,
                    },
                  ]}>
                  <IconSymbol
                    name={getSourceIcon(source.type)}
                    size={18}
                    color={iconColor}
                  />
                </View>
                <View style={styles.sourceText}>
                  <ThemedText style={styles.sourceTitle} numberOfLines={1}>
                    {source.title}
                  </ThemedText>
                  <View style={styles.sourceMetaRow}>
                    <ThemedText style={[styles.sourceDomain, { color: colors.textMuted }]}>
                      {source.domain}
                    </ThemedText>
                    <View style={[styles.typeBadge, { backgroundColor: `${iconColor}15` }]}>
                      <ThemedText style={[styles.typeLabel, { color: iconColor }]}>
                        {getSourceTypeLabel(source.type)}
                      </ThemedText>
                    </View>
                  </View>
                </View>
              </View>
              <View style={[styles.arrowContainer, { backgroundColor: `${colors.textMuted}10` }]}>
                <IconSymbol
                  name="arrow.up.right"
                  size={14}
                  color={colors.textMuted}
                />
              </View>
            </AnimatedPressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing['2xl'],
  },
  title: {
    fontSize: Typography.xs.fontSize,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.lg,
  },
  list: {
    gap: Spacing.md,
  },
  sourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  sourceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sourceText: {
    flex: 1,
  },
  sourceTitle: {
    fontSize: Typography.sm.fontSize,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  sourceMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sourceDomain: {
    fontSize: Typography.xs.fontSize,
  },
  typeBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  typeLabel: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  arrowContainer: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
});
