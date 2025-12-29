import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BriefingCard } from '@/components/briefing';
import { PulseColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getTodaysBriefings } from '@/data/mock';

export default function TodayScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? PulseColors.dark : PulseColors.light;
  const insets = useSafeAreaInsets();

  const briefings = getTodaysBriefings();

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

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 16 },
        ]}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={[styles.date, { color: PulseColors.primary }]}>
            {dateString}
          </ThemedText>
          <ThemedText type="title" style={styles.title}>
            {"Today's"}{'\n'}Briefings
          </ThemedText>
          {unreadBriefings.length > 0 ? (
            <View style={styles.statusContainer}>
              <View style={styles.statusDot} />
              <ThemedText style={[styles.status, { color: colors.textSecondary }]}>
                {unreadBriefings.length} new briefing
                {unreadBriefings.length !== 1 ? 's' : ''} available
              </ThemedText>
            </View>
          ) : (
            <ThemedText style={[styles.status, { color: colors.textMuted }]}>
              {"You're all caught up!"}
            </ThemedText>
          )}
        </View>

        {/* Briefing Cards */}
        <View style={styles.cardsContainer}>
          {briefings.map((briefing) => (
            <BriefingCard key={briefing.id} briefing={briefing} />
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <ThemedText style={[styles.footerText, { color: colors.textMuted }]}>
            Briefings refresh at 07:30, 13:30, and 20:30
          </ThemedText>
        </View>
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
    marginTop: 12,
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PulseColors.primary,
    shadowColor: PulseColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
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
});
