import { useState, useEffect, useCallback } from 'react';
import { ScrollView, StyleSheet, View, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BriefingCard } from '@/components/briefing';
import { FadeIn } from '@/components/ui/fade-in';
import { PulsingDot } from '@/components/ui/pulsing-dot';
import { SkeletonBriefingCard } from '@/components/ui/skeleton';
import { PulseColors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getTodaysBriefings, clearCache } from '@/services/briefings-api';
import type { Briefing } from '@/types/briefing';

export default function TodayScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? PulseColors.dark : PulseColors.light;
  const insets = useSafeAreaInsets();

  const [briefings, setBriefings] = useState<Briefing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadBriefings = useCallback(async () => {
    try {
      const data = await getTodaysBriefings();
      setBriefings(data);
    } catch (error) {
      console.error('Failed to load briefings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    clearCache();
    await loadBriefings();
    setRefreshing(false);
  }, [loadBriefings]);

  useEffect(() => {
    loadBriefings();
  }, [loadBriefings]);

  // Format today's date
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  // Count available briefings
  const availableBriefings = briefings.filter((b) => b.isAvailable);
  const unreadBriefings = availableBriefings.filter((b) => !b.isRead);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.content,
            { paddingTop: insets.top + 16 },
          ]}
          showsVerticalScrollIndicator={false}>
          {/* Skeleton Header */}
          <View style={styles.header}>
            <View style={[styles.skeletonDate, { backgroundColor: colors.border }]} />
            <View style={[styles.skeletonTitle, { backgroundColor: colors.border }]} />
            <View style={[styles.skeletonStatus, { backgroundColor: colors.border }]} />
          </View>

          {/* Skeleton Cards */}
          <View style={styles.cardsContainer}>
            <SkeletonBriefingCard style={{ marginBottom: 16 }} />
            <SkeletonBriefingCard style={{ marginBottom: 16 }} />
            <SkeletonBriefingCard style={{ marginBottom: 16 }} />
          </View>
        </ScrollView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 16 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={PulseColors.primary}
          />
        }>
        {/* Header */}
        <FadeIn delay={0}>
          <View style={styles.header}>
            <ThemedText style={[styles.date, { color: PulseColors.primary }]}>
              {dateString}
            </ThemedText>
            <ThemedText type="title" style={styles.title}>
              {"Today's"}{'\n'}Briefings
            </ThemedText>
            {unreadBriefings.length > 0 ? (
              <View style={styles.statusContainer}>
                <PulsingDot
                  color={PulseColors.primary}
                  size={8}
                  active={true}
                  glowIntensity={0.5}
                />
                <ThemedText style={[styles.status, { color: colors.textSecondary }]}>
                  {unreadBriefings.length} new briefing
                  {unreadBriefings.length !== 1 ? 's' : ''} available
                </ThemedText>
              </View>
            ) : (
              <View style={styles.statusContainer}>
                <PulsingDot
                  color={colors.textMuted}
                  size={6}
                  active={false}
                  glowIntensity={0.2}
                />
                <ThemedText style={[styles.status, { color: colors.textMuted }]}>
                  {"You're all caught up!"}
                </ThemedText>
              </View>
            )}
          </View>
        </FadeIn>

        {/* Briefing Cards */}
        <View style={styles.cardsContainer}>
          {briefings.map((briefing, index) => (
            <FadeIn key={briefing.id} delay={100 + index * 100}>
              <BriefingCard briefing={briefing} />
            </FadeIn>
          ))}
        </View>

        {/* Footer */}
        <FadeIn delay={100 + briefings.length * 100}>
          <View style={styles.footer}>
            <ThemedText style={[styles.footerText, { color: colors.textMuted }]}>
              Briefings refresh at 07:30, 13:30, and 20:30
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  date: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 42,
    letterSpacing: -0.5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },
  status: {
    fontSize: 14,
  },
  cardsContainer: {
    marginTop: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 12,
  },
  skeletonDate: {
    width: 120,
    height: 14,
    borderRadius: 4,
    marginBottom: 12,
  },
  skeletonTitle: {
    width: 180,
    height: 72,
    borderRadius: 8,
    marginBottom: 12,
  },
  skeletonStatus: {
    width: 160,
    height: 16,
    borderRadius: 4,
  },
});
