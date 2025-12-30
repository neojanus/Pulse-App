import { ReactNode, useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
  slideFrom?: 'none' | 'bottom' | 'top' | 'left' | 'right';
  slideDistance?: number;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 400,
  style,
  slideFrom = 'bottom',
  slideDistance = 20,
}: FadeInProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(
    slideFrom === 'bottom' ? slideDistance : slideFrom === 'top' ? -slideDistance : 0
  );
  const translateX = useSharedValue(
    slideFrom === 'right' ? slideDistance : slideFrom === 'left' ? -slideDistance : 0
  );

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration, easing: Easing.out(Easing.cubic) })
    );
    translateY.value = withDelay(
      delay,
      withTiming(0, { duration, easing: Easing.out(Easing.cubic) })
    );
    translateX.value = withDelay(
      delay,
      withTiming(0, { duration, easing: Easing.out(Easing.cubic) })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
    ],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}
