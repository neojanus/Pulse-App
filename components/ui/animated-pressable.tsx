import { ReactNode } from 'react';
import { Platform, Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

type HapticStyle = 'light' | 'medium' | 'heavy' | 'none';

interface AnimatedPressableProps extends PressableProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Scale value when pressed (0.9-0.99 recommended) */
  scaleValue?: number;
  disabled?: boolean;
  /** Haptic feedback style on press */
  haptic?: HapticStyle;
  /** Enable overshoot bounce on release for playful feel */
  bouncy?: boolean;
}

/**
 * AnimatedPressable - A premium button component with:
 * - Spring-based scale animation
 * - Haptic feedback on iOS
 * - Optional bouncy overshoot effect
 * - Smooth opacity transition
 */
export function AnimatedPressable({
  children,
  style,
  scaleValue = 0.97,
  disabled,
  haptic = 'light',
  bouncy = false,
  onPressIn,
  onPressOut,
  onPress,
  ...props
}: AnimatedPressableProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    // Add subtle shadow intensity change based on scale
    const shadowOpacity = interpolate(scale.value, [scaleValue, 1], [0.1, 0.2]);

    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
      shadowOpacity,
    };
  });

  const triggerHaptic = () => {
    if (Platform.OS !== 'ios' || haptic === 'none') return;

    switch (haptic) {
      case 'light':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
    }
  };

  const handlePressIn = (e: any) => {
    // Trigger haptic on press start
    triggerHaptic();

    // Quick, snappy press animation
    scale.value = withSpring(scaleValue, {
      damping: 20,
      stiffness: 400,
      mass: 0.8,
    });
    opacity.value = withTiming(0.85, { duration: 80 });
    onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    // Bouncy release with overshoot, or standard spring
    const springConfig = bouncy
      ? { damping: 8, stiffness: 350, mass: 0.6 }  // Overshoot bounce
      : { damping: 15, stiffness: 400, mass: 0.8 }; // Standard spring

    scale.value = withSpring(1, springConfig);
    opacity.value = withTiming(1, { duration: 100 });
    onPressOut?.(e);
  };

  const handlePress = (e: any) => {
    onPress?.(e);
  };

  return (
    <AnimatedPressableBase
      style={[animatedStyle, style]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
      {...props}>
      {children}
    </AnimatedPressableBase>
  );
}
