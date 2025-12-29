import { View, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PulseColors } from '@/constants/theme';
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

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingBottom: insets.bottom + 16,
        },
      ]}>
      <View style={styles.gradient} />
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: isRead ? colors.surfaceHighlight : PulseColors.primary,
          },
          pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
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
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  gradient: {
    position: 'absolute',
    top: -24,
    left: 0,
    right: 0,
    height: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: PulseColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
