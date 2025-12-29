// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<string, ComponentProps<typeof MaterialIcons>['name']>;

/**
 * SF Symbols to Material Icons mappings.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING: IconMapping = {
  // Navigation & Tab Icons
  'house.fill': 'home',
  'newspaper': 'article',
  'newspaper.fill': 'article',
  'archivebox': 'inventory-2',
  'archivebox.fill': 'inventory-2',
  'gearshape': 'settings',
  'gearshape.fill': 'settings',
  'paperplane.fill': 'send',

  // Briefing Period Icons
  'sun.horizon': 'wb-twilight',
  'sun.max': 'light-mode',
  'moon.stars': 'bedtime',

  // Action Icons
  'chevron.right': 'chevron-right',
  'chevron.left': 'chevron-left',
  'chevron.down': 'expand-more',
  'chevron.up': 'expand-less',
  'arrow.left': 'arrow-back',
  'arrow.right': 'arrow-forward',
  'arrow.up.right': 'open-in-new',
  'xmark': 'close',

  // Content Icons
  'bookmark': 'bookmark-border',
  'bookmark.fill': 'bookmark',
  'square.and.arrow.up': 'share',
  'checkmark.circle': 'check-circle',
  'checkmark.circle.fill': 'check-circle',
  'checkmark': 'check',
  'clock': 'schedule',
  'magnifyingglass': 'search',
  'doc.text': 'description',
  'chevron.left.forwardslash.chevron.right': 'code',
  'info.circle': 'info',
  'doc.on.doc': 'content-copy',
  'link': 'link',
  'globe': 'language',
  'calendar': 'calendar-today',

  // Status Icons
  'bolt.fill': 'bolt',
  'star.fill': 'star',
  'exclamationmark.triangle': 'warning',
  'exclamationmark.circle': 'error',

  // Misc
  'ellipsis': 'more-horiz',
  'line.3.horizontal': 'menu',
  'person': 'person-outline',
  'person.fill': 'person',
  'bell': 'notifications-none',
  'bell.fill': 'notifications',
};

export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const iconName = MAPPING[name];
  if (!iconName) {
    console.warn(`IconSymbol: No mapping found for "${name}"`);
    return null;
  }
  return <MaterialIcons color={color} size={size} name={iconName} style={style} />;
}
