import { View, StyleSheet, Pressable } from 'react-native';
import * as Clipboard from 'expo-clipboard';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PulseColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface WhatToTrySectionProps {
  description: string;
  code?: string;
  note?: string;
}

export function WhatToTrySection({
  description,
  code,
  note,
}: WhatToTrySectionProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? PulseColors.dark : PulseColors.light;

  const handleCopy = async () => {
    if (code) {
      await Clipboard.setStringAsync(code);
      // TODO: Show toast feedback
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>What to try</ThemedText>

      {code && (
        <View style={[styles.codeBlock, { backgroundColor: isDark ? '#000' : '#1e293b' }]}>
          <Pressable onPress={handleCopy} style={styles.copyButton}>
            <IconSymbol name="doc.on.doc" size={16} color="#94a3b8" />
          </Pressable>
          <ThemedText style={[styles.codeDescription, { color: '#94a3b8' }]}>
            {description}
          </ThemedText>
          <View style={styles.codeContainer}>
            <ThemedText style={styles.codeText}>{code}</ThemedText>
          </View>
          {note && (
            <View style={styles.noteContainer}>
              <IconSymbol name="info.circle" size={14} color="#94a3b8" />
              <ThemedText style={styles.noteText}>{note}</ThemedText>
            </View>
          )}
        </View>
      )}

      {!code && (
        <ThemedText style={[styles.descriptionOnly, { color: colors.textSecondary }]}>
          {description}
        </ThemedText>
      )}
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
  codeBlock: {
    borderRadius: 12,
    padding: 16,
    position: 'relative',
  },
  copyButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
    opacity: 0.7,
  },
  codeDescription: {
    fontSize: 13,
    marginBottom: 12,
  },
  codeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#4ade80',
    lineHeight: 20,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  noteText: {
    fontSize: 13,
    color: '#94a3b8',
  },
  descriptionOnly: {
    fontSize: 15,
    lineHeight: 22,
  },
});
