import { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { PulseColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}: SkeletonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? PulseColors.dark : PulseColors.light;

  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 1], [0.4, 0.7]),
  }));

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: colors.border,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

interface SkeletonCardProps {
  style?: ViewStyle;
}

export function SkeletonCard({ style }: SkeletonCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? PulseColors.dark : PulseColors.light;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }, style]}>
      <View style={styles.cardHeader}>
        <Skeleton width={80} height={14} borderRadius={4} />
        <Skeleton width={60} height={14} borderRadius={4} />
      </View>
      <Skeleton width="90%" height={20} borderRadius={4} style={styles.title} />
      <Skeleton width="100%" height={16} borderRadius={4} style={styles.line} />
      <Skeleton width="75%" height={16} borderRadius={4} style={styles.line} />
    </View>
  );
}

export function SkeletonBriefingCard({ style }: SkeletonCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? PulseColors.dark : PulseColors.light;

  return (
    <View style={[styles.briefingCard, { backgroundColor: colors.surface }, style]}>
      <View style={styles.briefingHeader}>
        <Skeleton width={48} height={48} borderRadius={12} />
        <View style={styles.briefingInfo}>
          <Skeleton width={120} height={18} borderRadius={4} />
          <Skeleton width={80} height={14} borderRadius={4} style={{ marginTop: 6 }} />
        </View>
      </View>
      <View style={styles.briefingItems}>
        <Skeleton width="100%" height={14} borderRadius={4} />
        <Skeleton width="85%" height={14} borderRadius={4} style={{ marginTop: 8 }} />
        <Skeleton width="70%" height={14} borderRadius={4} style={{ marginTop: 8 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    marginBottom: 8,
  },
  line: {
    marginTop: 6,
  },
  briefingCard: {
    borderRadius: 16,
    padding: 20,
  },
  briefingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  briefingInfo: {
    flex: 1,
  },
  briefingItems: {
    paddingTop: 8,
  },
});
