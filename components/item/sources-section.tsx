import { View, StyleSheet, Pressable, Linking } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PulseColors } from '@/constants/theme';
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

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Sources</ThemedText>
      <View style={styles.list}>
        {sources.map((source) => (
          <Pressable
            key={source.id}
            onPress={() => handleSourcePress(source.url)}
            style={({ pressed }) => [
              styles.sourceCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
              pressed && {
                borderColor: PulseColors.primary,
                opacity: 0.9,
              },
            ]}>
            <View style={styles.sourceContent}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: isDark ? '#000' : '#f1f5f9' },
                ]}>
                <IconSymbol
                  name={getSourceIcon(source.type)}
                  size={18}
                  color={colors.text}
                />
              </View>
              <View style={styles.sourceText}>
                <ThemedText style={styles.sourceTitle}>{source.title}</ThemedText>
                <ThemedText style={[styles.sourceDomain, { color: colors.textMuted }]}>
                  {source.domain} • {getSourceTypeLabel(source.type)}
                </ThemedText>
              </View>
            </View>
            <IconSymbol
              name="arrow.up.right"
              size={16}
              color={colors.textMuted}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#64748b',
    marginBottom: 16,
  },
  list: {
    gap: 12,
  },
  sourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  sourceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sourceText: {
    flex: 1,
  },
  sourceTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  sourceDomain: {
    fontSize: 12,
    marginTop: 2,
  },
});
