import { useLocalSearchParams, router } from 'expo-router';
import { useState, useMemo, useEffect } from 'react';
import { StyleSheet, View, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Divider } from '@/components/ui/divider';
import {
  ExecutiveSummary,
  CategoryFilter,
  BriefingItemRow,
  MarkAsReadButton,
} from '@/components/briefing';
import { PulseColors } from '@/constants/theme';
import { PeriodConfig } from '@/constants/categories';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getBriefingById } from '@/services/briefings-api';
import type { Briefing, BriefingCategory } from '@/types/briefing';

export default function BriefingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? PulseColors.dark : PulseColors.light;
  const insets = useSafeAreaInsets();

  const [briefing, setBriefing] = useState<Briefing | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<BriefingCategory | 'all'>('all');
  const [isRead, setIsRead] = useState(false);

  useEffect(() => {
    async function loadBriefing() {
      const data = await getBriefingById(id);
      setBriefing(data);
      setLoading(false);
    }
    loadBriefing();
  }, [id]);

  const filteredItems = useMemo(() => {
    if (!briefing) return [];
    if (activeCategory === 'all') return briefing.items;
    return briefing.items.filter((item) => item.category === activeCategory);
  }, [briefing, activeCategory]);

  if (loading) {
    return (
      <ThemedView style={[styles.container, styles.emptyContent]}>
        <ActivityIndicator size="large" color={PulseColors.primary} />
      </ThemedView>
    );
  }

  if (!briefing) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="arrow.left" size={24} color={colors.text} />
          </Pressable>
        </View>
        <View style={styles.emptyContent}>
          <ThemedText>Briefing not found</ThemedText>
        </View>
      </ThemedView>
    );
  }

  const periodConfig = PeriodConfig[briefing.period];

  // Format date
  const briefingDate = new Date(briefing.date);
  const dateString = briefingDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const handleMarkAsRead = () => {
    setIsRead(true);
    // TODO: Persist to storage
  };

  return (
    <ThemedView style={styles.container}>
      {/* Sticky Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top,
            borderBottomColor: colors.border,
            backgroundColor: colors.background,
          },
        ]}>
        {/* Progress Bar */}
        <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: PulseColors.primary,
                width: isRead ? '100%' : '35%',
              },
            ]}
          />
        </View>

        <View style={styles.headerContent}>
          <Pressable
            onPress={() => router.back()}
            style={[styles.backButton, { backgroundColor: colors.surfaceHighlight }]}>
            <IconSymbol name="arrow.left" size={22} color={colors.text} />
          </Pressable>
          <View style={styles.headerActions}>
            <Pressable
              style={[styles.actionButton, { backgroundColor: colors.surfaceHighlight }]}>
              <IconSymbol name="bookmark" size={20} color={colors.text} />
            </Pressable>
            <Pressable
              style={[styles.actionButton, { backgroundColor: colors.surfaceHighlight }]}>
              <IconSymbol name="square.and.arrow.up" size={20} color={colors.text} />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <ThemedText style={[styles.date, { color: PulseColors.primary }]}>
            {dateString} • {periodConfig.time}
          </ThemedText>
          <ThemedText type="title" style={styles.title}>
            {periodConfig.label}
            {'\n'}Briefing
          </ThemedText>
        </View>

        {/* Executive Summary */}
        <View style={styles.summarySection}>
          <ExecutiveSummary summary={briefing.executiveSummary} />
        </View>

        {/* Category Filter */}
        <CategoryFilter
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Items List */}
        <View style={styles.itemsList}>
          {filteredItems.map((item, index) => (
            <View key={item.id}>
              <BriefingItemRow item={item} />
              {index < filteredItems.length - 1 && (
                <Divider style={styles.itemDivider} />
              )}
            </View>
          ))}
        </View>

        {/* End Indicator */}
        <View style={styles.endIndicator}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <MarkAsReadButton onPress={handleMarkAsRead} isRead={isRead} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  progressBar: {
    height: 3,
    width: '100%',
  },
  progressFill: {
    height: '100%',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  emptyContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  titleSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  date: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    lineHeight: 46,
    letterSpacing: -0.5,
  },
  summarySection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  itemsList: {
    paddingTop: 8,
  },
  itemDivider: {
    marginHorizontal: 16,
  },
  endIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 24,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#64748b',
  },
});
