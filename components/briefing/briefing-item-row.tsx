import { View, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Badge } from '@/components/ui/badge';
import { PulseColors } from '@/constants/theme';
import { CategoryConfig } from '@/constants/categories';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { BriefingItem } from '@/types/briefing';

interface BriefingItemRowProps {
  item: BriefingItem;
}

export function BriefingItemRow({ item }: BriefingItemRowProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? PulseColors.dark : PulseColors.light;
  const categoryConfig = CategoryConfig[item.category];

  const handlePress = () => {
    router.push(`/item/${item.id}`);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        pressed && { opacity: 0.7, backgroundColor: colors.surfaceHighlight },
      ]}>
      <View style={styles.content}>
        <Badge
          label={categoryConfig.label}
          color={categoryConfig.colors.text}
          backgroundColor={isDark ? categoryConfig.colors.bgDark : categoryConfig.colors.bg}
          size="sm"
        />
        <ThemedText style={styles.title} numberOfLines={2}>
          {item.title}
        </ThemedText>
        <ThemedText
          style={[styles.tldr, { color: colors.textSecondary }]}
          numberOfLines={2}>
          {item.tldr}
        </ThemedText>
        <View style={styles.meta}>
          <IconSymbol name="clock" size={14} color={colors.textMuted} />
          <ThemedText style={[styles.metaText, { color: colors.textMuted }]}>
            {item.readTimeMinutes} min read
          </ThemedText>
        </View>
      </View>
      <IconSymbol name="chevron.right" size={20} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  content: {
    flex: 1,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  tldr: {
    fontSize: 14,
    lineHeight: 20,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  metaText: {
    fontSize: 12,
  },
});
