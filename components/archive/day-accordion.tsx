import { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BriefingRow } from './briefing-row';
import { PulseColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { DailyBriefings } from '@/types/briefing';

interface DayAccordionProps {
  day: DailyBriefings;
  isToday?: boolean;
  defaultOpen?: boolean;
}

export function DayAccordion({
  day,
  isToday = false,
  defaultOpen = false,
}: DayAccordionProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? PulseColors.dark : PulseColors.light;

  const [isOpen, setIsOpen] = useState(defaultOpen);
  const rotation = useSharedValue(defaultOpen ? 180 : 0);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    rotation.value = withTiming(isOpen ? 0 : 180, { duration: 200 });
  };

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}>
      {/* Header */}
      <Pressable
        onPress={toggleOpen}
        style={({ pressed }) => [
          styles.header,
          pressed && { opacity: 0.8 },
        ]}>
        <View style={styles.headerContent}>
          {isToday && (
            <View style={styles.todayDot} />
          )}
          <ThemedText style={styles.dateText}>{day.displayDate}</ThemedText>
        </View>
        <Animated.View style={chevronStyle}>
          <IconSymbol name="chevron.down" size={20} color={colors.textSecondary} />
        </Animated.View>
      </Pressable>

      {/* Content */}
      {isOpen && (
        <View style={styles.content}>
          {day.briefings.map((briefing) => (
            <BriefingRow key={briefing.id} briefing={briefing} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  todayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PulseColors.primary,
    shadowColor: PulseColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
});
