import { View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AnimatedPressable } from '@/components/ui/animated-pressable';
import { PulseColors, BorderRadius, Spacing, Shadows } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface MarkAsReadButtonProps {
  onPress: () => void;
  isRead?: boolean;
}

export function MarkAsReadButton({ onPress, isRead }: MarkAsReadButtonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? PulseColors.dark : PulseColors.light;
  const insets = useSafeAreaInsets();

  // Gradient colors: transparent to background
  const gradientColors = isDark
    ? ['transparent', 'rgba(10, 10, 10, 0.8)', colors.background]
    : ['transparent', 'rgba(255, 255, 255, 0.8)', colors.background];

  const handlePress = () => {
    // Haptic feedback on successful action
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(
        isRead
          ? Haptics.NotificationFeedbackType.Warning
          : Haptics.NotificationFeedbackType.Success
      );
    }
    onPress();
  };

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      {/* Gradient fade overlay */}
      <LinearGradient
        colors={gradientColors as [string, string, string]}
        locations={[0, 0.5, 1]}
        style={styles.gradient}
        pointerEvents="none"
      />

      {/* Button container */}
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            paddingBottom: insets.bottom + Spacing.lg,
          },
        ]}>
        <AnimatedPressable
          onPress={handlePress}
          haptic={isRead ? 'light' : 'medium'}
          bouncy={!isRead}
          style={[
            styles.button,
            isRead
              ? {
                  backgroundColor: colors.surfaceHighlight,
                  borderWidth: 1,
                  borderColor: `${PulseColors.primary}30`,
                }
              : {
                  backgroundColor: PulseColors.primary,
                  ...Shadows.glow(PulseColors.primary, 0.25),
                },
          ]}>
          <IconSymbol
            name={isRead ? 'checkmark.circle.fill' : 'checkmark.circle'}
            size={20}
            color={isRead ? PulseColors.primary : '#fff'}
          />
          <ThemedText
            style={[
              styles.buttonText,
              { color: isRead ? PulseColors.primary : '#fff' },
            ]}>
            {isRead ? 'Marked as Read' : 'Mark Briefing as Read'}
          </ThemedText>
        </AnimatedPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  gradient: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    right: 0,
    height: 48,
  },
  container: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
