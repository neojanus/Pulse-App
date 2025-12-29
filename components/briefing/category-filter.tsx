import { ScrollView, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { PulseColors } from '@/constants/theme';
import { CategoryConfig, ALL_CATEGORIES } from '@/constants/categories';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { BriefingCategory } from '@/types/briefing';

interface CategoryFilterProps {
  activeCategory: BriefingCategory | 'all';
  onCategoryChange: (category: BriefingCategory | 'all') => void;
}

export function CategoryFilter({
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? PulseColors.dark : PulseColors.light;

  const categories: { key: BriefingCategory | 'all'; label: string }[] = [
    { key: 'all', label: 'All' },
    ...ALL_CATEGORIES.map((cat) => ({
      key: cat,
      label: CategoryConfig[cat].label,
    })),
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {categories.map(({ key, label }) => {
        const isActive = activeCategory === key;
        const categoryColor =
          key === 'all'
            ? PulseColors.primary
            : CategoryConfig[key as BriefingCategory].colors.text;

        return (
          <Pressable
            key={key}
            onPress={() => onCategoryChange(key)}
            style={[
              styles.chip,
              {
                backgroundColor: isActive
                  ? categoryColor
                  : colors.surfaceHighlight,
                borderColor: isActive ? categoryColor : colors.border,
              },
            ]}>
            <ThemedText
              style={[
                styles.chipText,
                {
                  color: isActive ? '#fff' : colors.textSecondary,
                },
              ]}>
              {label}
            </ThemedText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
