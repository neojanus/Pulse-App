import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AnimatedPressable } from '@/components/ui/animated-pressable';
import { FadeIn } from '@/components/ui/fade-in';
import { PulseColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function WelcomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? PulseColors.dark : PulseColors.light;
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
        <View style={styles.header}>
          <FadeIn delay={0} slideFrom="none">
            <View style={styles.logoContainer}>
              <View style={[styles.logo, { backgroundColor: PulseColors.primary }]}>
                <ThemedText style={styles.logoText}>P</ThemedText>
              </View>
            </View>
          </FadeIn>
          <FadeIn delay={100}>
            <ThemedText type="title" style={styles.title}>
              Pulse
            </ThemedText>
          </FadeIn>
          <FadeIn delay={200}>
            <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
              Your daily AI briefings,{'\n'}curated for builders
            </ThemedText>
          </FadeIn>
        </View>

        <View style={styles.features}>
          <FadeIn delay={300}>
            <FeatureItem text="3 daily briefings at 7:30, 13:30, 20:30" />
          </FadeIn>
          <FadeIn delay={400}>
            <FeatureItem text="Curated from top AI sources" />
          </FadeIn>
          <FadeIn delay={500}>
            <FeatureItem text="Actionable insights for founders" />
          </FadeIn>
        </View>
      </View>

      <FadeIn delay={600} style={[styles.buttons, { paddingBottom: insets.bottom + 20 }]}>
        <AnimatedPressable
          style={[styles.button, styles.primaryButton]}
          onPress={() => router.push('/auth/signup')}>
          <ThemedText style={styles.primaryButtonText}>Get Started</ThemedText>
        </AnimatedPressable>

        <AnimatedPressable
          style={[styles.button, styles.secondaryButton, { borderColor: colors.border }]}
          onPress={() => router.push('/auth/login')}>
          <ThemedText style={[styles.secondaryButtonText, { color: colors.text }]}>
            I already have an account
          </ThemedText>
        </AnimatedPressable>
      </FadeIn>
    </ThemedView>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureDot} />
      <ThemedText style={styles.featureText}>{text}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 40,
    fontWeight: '800',
    color: '#fff',
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
  },
  features: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PulseColors.primary,
  },
  featureText: {
    fontSize: 16,
  },
  buttons: {
    paddingHorizontal: 24,
    gap: 12,
  },
  button: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: PulseColors.primary,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 17,
    fontWeight: '600',
  },
});
