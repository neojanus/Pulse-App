import { ReactNode, Children, cloneElement, isValidElement } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { FadeIn } from './fade-in';

interface StaggeredListProps {
  children: ReactNode;
  staggerDelay?: number;
  initialDelay?: number;
  style?: StyleProp<ViewStyle>;
}

export function StaggeredList({
  children,
  staggerDelay = 50,
  initialDelay = 0,
  style,
}: StaggeredListProps) {
  return (
    <>
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child;

        return (
          <FadeIn
            key={index}
            delay={initialDelay + index * staggerDelay}
            style={style}>
            {child}
          </FadeIn>
        );
      })}
    </>
  );
}
