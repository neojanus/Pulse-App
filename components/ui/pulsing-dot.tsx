import { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';

import { PulseColors, Shadows } from '@/constants/theme';

interface PulsingDotProps {
  /** Dot color - defaults to primary */
  color?: string;
  /** Dot size in pixels - defaults to 8 */
  size?: number;
  /** Whether the dot should pulse - defaults to true */
  active?: boolean;
  /** Glow intensity (0-1) - defaults to 0.6 */
  glowIntensity?: number;
  style?: ViewStyle;
}

/**
 * PulsingDot - Animated status indicator with glow effect
 *
 * Features:
 * - Smooth breathing/pulse animation
 * - Customizable color and size
 * - Glowing shadow effect
 * - Can be toggled on/off
 */
export function PulsingDot({
  color = PulseColors.primary,
  size = 8,
  active = true,
  glowIntensity = 0.6,
  style,
}: PulsingDotProps) {
  const pulseValue = useSharedValue(0);

  useEffect(() => {
    if (active) {
      pulseValue.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    } else {
      pulseValue.value = withTiming(0, { duration: 300 });
    }
  }, [active, pulseValue]);

  const animatedDotStyle = useAnimatedStyle(() => {
    const scale = interpolate(pulseValue.value, [0, 1], [1, 1.15]);
    const opacity = interpolate(pulseValue.value, [0, 1], [0.85, 1]);

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const animatedGlowStyle = useAnimatedStyle(() => {
    const glowScale = interpolate(pulseValue.value, [0, 1], [1, 2.5]);
    const glowOpacity = interpolate(pulseValue.value, [0, 1], [glowIntensity, 0.1]);

    return {
      transform: [{ scale: glowScale }],
      opacity: glowOpacity,
    };
  });

  return (
    <View style={[styles.container, { width: size * 3, height: size * 3 }, style]}>
      {/* Animated glow ring */}
      {active && (
        <Animated.View
          style={[
            styles.glow,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: color,
            },
            animatedGlowStyle,
          ]}
        />
      )}

      {/* Main dot */}
      <Animated.View
        style={[
          styles.dot,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            ...Shadows.glow(color, glowIntensity),
          },
          active && animatedDotStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
  },
  dot: {
    zIndex: 1,
  },
});
