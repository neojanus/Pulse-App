import { useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Badge } from '@/components/ui/badge';
import { Divider } from '@/components/ui/divider';
import {
  TLDRCard,
  WhyItMattersSection,
  WhatToTrySection,
  SourcesSection,
  TagsRow,
} from '@/components/item';
import { PulseColors, SemanticColors } from '@/constants/theme';
import { CategoryConfig } from '@/constants/categories';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { formatRelativeTime, isOlderThan } from '@/utils/format-date';
import { getItemById } from '@/services/briefings-api';
import type { BriefingItem } from '@/types/briefing';

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? PulseColors.dark : PulseColors.light;
  const insets = useSafeAreaInsets();

  const [item, setItem] = useState<BriefingItem | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadItem() {
      const data = await getItemById(id);
      setItem(data);
      setLoading(false);
    }
    loadItem();
  }, [id]);

  if (loading) {
    return (
      <ThemedView style={[styles.container, styles.emptyContent]}>
        <ActivityIndicator size="large" color={PulseColors.primary} />
      </ThemedView>
    );
  }

  if (!item) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="arrow.left" size={24} color={colors.text} />
          </Pressable>
        </View>
        <View style={styles.emptyContent}>
          <ThemedText>Item not found</ThemedText>
        </View>
      </ThemedView>
    );
  }

  const categoryConfig = CategoryConfig[item.category];
  const isOld = isOlderThan(item.publishedAt, 24);
  const relativeTime = formatRelativeTime(item.publishedAt);

  return (
    <ThemedView style={styles.container}>
      {/* Sticky Header with Glass Effect */}
      <BlurView
        intensity={Platform.OS === 'ios' ? 80 : 100}
        tint={isDark ? 'dark' : 'light'}
        style={[
          styles.header,
          {
            paddingTop: insets.top,
            borderBottomColor: colors.border,
          },
        ]}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backButton, { backgroundColor: `${colors.surfaceHighlight}CC` }]}>
          <IconSymbol name="arrow.left" size={22} color={colors.text} />
        </Pressable>
        <View style={styles.headerActions}>
          <Pressable
            style={[styles.actionButton, { backgroundColor: `${colors.surfaceHighlight}CC` }]}>
            <IconSymbol name="bookmark" size={20} color={colors.text} />
          </Pressable>
          <Pressable
            style={[styles.actionButton, { backgroundColor: `${colors.surfaceHighlight}CC` }]}>
            <IconSymbol name="square.and.arrow.up" size={20} color={colors.text} />
          </Pressable>
        </View>
      </BlurView>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          {/* Category Badge */}
          <Badge
            label={categoryConfig.label}
            color={categoryConfig.colors.text}
            backgroundColor={
              isDark ? categoryConfig.colors.bgDark : categoryConfig.colors.bg
            }
            size="md"
            style={styles.categoryBadge}
          />

          {/* Title */}
          <ThemedText style={styles.title}>{item.title}</ThemedText>

          {/* Meta */}
          <View style={styles.meta}>
            <View style={styles.metaItem}>
              <IconSymbol name="clock" size={14} color={colors.textMuted} />
              <ThemedText style={[styles.metaText, { color: colors.textMuted }]}>
                {item.readTimeMinutes} min read
              </ThemedText>
            </View>
            {relativeTime && (
              <View style={styles.metaItem}>
                <IconSymbol
                  name="calendar"
                  size={14}
                  color={isOld ? SemanticColors.warning : colors.textMuted}
                />
                <ThemedText
                  style={[
                    styles.metaText,
                    { color: isOld ? SemanticColors.warning : colors.textMuted },
                  ]}>
                  {relativeTime}
                </ThemedText>
              </View>
            )}
          </View>

          {/* Tags */}
          <TagsRow tags={item.tags} />
        </View>

        <Divider style={styles.divider} />

        {/* Content Sections */}
        <View style={styles.contentSection}>
          {/* TL;DR */}
          <TLDRCard text={item.tldr} />

          {/* Why It Matters */}
          <WhyItMattersSection points={item.whyItMatters} />

          {/* What to Try */}
          <WhatToTrySection
            description={item.whatToTry.description}
            code={item.whatToTry.code}
            note={item.whatToTry.note}
          />

          {/* Sources */}
          <SourcesSection sources={item.sources} />
        </View>
      </ScrollView>

      {/* Background gradient effect */}
      <View
        style={[
          styles.backgroundGlow,
          { opacity: isDark ? 0.15 : 0.05 },
        ]}
        pointerEvents="none"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    zIndex: 10,
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
    paddingBottom: 40,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  categoryBadge: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    letterSpacing: -0.3,
    marginBottom: 16,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
  },
  divider: {
    marginHorizontal: 20,
  },
  contentSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backgroundGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: PulseColors.primary,
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
    zIndex: -1,
  },
});
