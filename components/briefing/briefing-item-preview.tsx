import { View, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Divider } from '@/components/ui/divider';
import { PulseColors } from '@/constants/theme';
import { CategoryConfig } from '@/constants/categories';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { BriefingItem } from '@/types/briefing';

interface BriefingItemPreviewProps {
  item: BriefingItem;
  isLast?: boolean;
}

export function BriefingItemPreview({ item, isLast }: BriefingItemPreviewProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? PulseColors.dark : PulseColors.light;
  const categoryConfig = CategoryConfig[item.category];

  const handlePress = () => {
    router.push(`/item/${item.id}`);
  };

  return (
    <>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.container,
          pressed && { opacity: 0.7 },
        ]}>
        <View style={styles.content}>
          <View
            style={[
              styles.categoryDot,
              { backgroundColor: categoryConfig.colors.text },
            ]}
          />
          <View style={styles.textContainer}>
            <ThemedText
              numberOfLines={2}
              style={[styles.title, { color: colors.text }]}>
              {item.title}
            </ThemedText>
            <View style={styles.meta}>
              <ThemedText style={[styles.category, { color: categoryConfig.colors.text }]}>
                {categoryConfig.label}
              </ThemedText>
              <ThemedText style={[styles.readTime, { color: colors.textMuted }]}>
                · {item.readTimeMinutes} min
              </ThemedText>
            </View>
          </View>
        </View>
        <IconSymbol name="chevron.right" size={16} color={colors.textMuted} />
      </Pressable>
      {!isLast && <Divider style={styles.divider} />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 20,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  category: {
    fontSize: 12,
    fontWeight: '600',
  },
  readTime: {
    fontSize: 12,
    marginLeft: 4,
  },
  divider: {
    marginLeft: 16,
  },
});
