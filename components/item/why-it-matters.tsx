import { View, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PulseColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface WhyItMattersSectionProps {
  points: string[];
}

export function WhyItMattersSection({ points }: WhyItMattersSectionProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? PulseColors.dark : PulseColors.light;

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Why it matters</ThemedText>
      <View style={styles.list}>
        {points.map((point, index) => (
          <View key={index} style={styles.item}>
            <View style={styles.iconContainer}>
              <IconSymbol name="checkmark" size={12} color={PulseColors.primary} />
            </View>
            <ThemedText style={[styles.text, { color: colors.textSecondary }]}>
              {point}
            </ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  list: {
    gap: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: PulseColors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  text: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
});
