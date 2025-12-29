import { ScrollView, View, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { PulseColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { BriefingTag } from '@/types/briefing';

interface TagsRowProps {
  tags: BriefingTag[];
}

export function TagsRow({ tags }: TagsRowProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? PulseColors.dark : PulseColors.light;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {tags.map((tag) => (
        <View
          key={tag.id}
          style={[
            styles.tag,
            {
              backgroundColor: colors.surfaceHighlight,
              borderColor: colors.border,
            },
          ]}>
          <ThemedText style={[styles.tagText, { color: colors.textSecondary }]}>
            {tag.label}
          </ThemedText>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingVertical: 4,
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
