import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, ScrollView, TextInput, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { FadeIn } from '@/components/ui/fade-in';
import { Skeleton } from '@/components/ui/skeleton';
import { DayAccordion } from '@/components/archive';
import { PulseColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getArchiveBriefings, clearCache } from '@/services/briefings-api';
import type { DailyBriefings } from '@/types/briefing';

export default function ArchiveScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? PulseColors.dark : PulseColors.light;
  const insets = useSafeAreaInsets();

  const [archiveDays, setArchiveDays] = useState<DailyBriefings[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadArchive = useCallback(async () => {
    const data = await getArchiveBriefings();
    setArchiveDays(data);
    setLoading(false);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    clearCache();
    await loadArchive();
    setRefreshing(false);
  }, [loadArchive]);

  useEffect(() => {
    loadArchive();
  }, [loadArchive]);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              paddingTop: insets.top + 8,
              borderBottomColor: colors.border,
            },
          ]}>
          <View style={styles.headerTop}>
            <Skeleton width={100} height={28} borderRadius={6} />
            <Skeleton width={22} height={22} borderRadius={11} />
          </View>
          <Skeleton width="100%" height={48} borderRadius={12} />
        </View>

        <View style={styles.scrollContent}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={[styles.skeletonDay, { backgroundColor: colors.surface }]}>
              <Skeleton width={140} height={18} borderRadius={4} />
              <Skeleton width={80} height={14} borderRadius={4} style={{ marginTop: 8 }} />
            </View>
          ))}
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <FadeIn delay={0} slideFrom="none">
        <View
          style={[
            styles.header,
            {
              paddingTop: insets.top + 8,
              borderBottomColor: colors.border,
            },
          ]}>
          <View style={styles.headerTop}>
            <ThemedText type="title" style={styles.title}>
              Archive
            </ThemedText>
            <IconSymbol name="gearshape" size={22} color={colors.textSecondary} />
          </View>

          {/* Search Bar */}
          <View
            style={[
              styles.searchContainer,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}>
            <IconSymbol
              name="magnifyingglass"
              size={18}
              color={colors.textSecondary}
            />
            <TextInput
              placeholder="Search keywords (e.g., LLMs, Funding)..."
              placeholderTextColor={colors.textMuted}
              style={[styles.searchInput, { color: colors.text }]}
              editable={false} // Disabled for V1
            />
          </View>
        </View>
      </FadeIn>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={PulseColors.primary}
          />
        }>
        {archiveDays.map((day, index) => (
          <FadeIn key={day.date} delay={50 + index * 50}>
            <DayAccordion
              day={day}
              isToday={index === 0}
              defaultOpen={index === 0}
            />
          </FadeIn>
        ))}

        {/* End Message */}
        <FadeIn delay={50 + archiveDays.length * 50}>
          <View style={styles.endMessage}>
            <ThemedText style={[styles.endText, { color: colors.textMuted }]}>
              Briefings are available for 30 days
            </ThemedText>
          </View>
        </FadeIn>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  endMessage: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  endText: {
    fontSize: 12,
  },
  skeletonDay: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
});
