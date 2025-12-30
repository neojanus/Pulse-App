import { useState } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AnimatedPressable } from '@/components/ui/animated-pressable';
import { FadeIn } from '@/components/ui/fade-in';
import { PulseColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { signIn } from '@/services/auth';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? PulseColors.dark : PulseColors.light;
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <FadeIn delay={0} slideFrom="none">
          <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
            <AnimatedPressable onPress={() => router.back()} style={styles.backButton}>
              <IconSymbol name="arrow.left" size={24} color={colors.text} />
            </AnimatedPressable>
          </View>
        </FadeIn>

        <View style={styles.content}>
          <FadeIn delay={100}>
            <ThemedText type="title" style={styles.title}>
              Welcome back
            </ThemedText>
          </FadeIn>
          <FadeIn delay={150}>
            <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
              Sign in to continue to Pulse
            </ThemedText>
          </FadeIn>

          <View style={styles.form}>
            <FadeIn delay={200}>
              <View style={styles.inputContainer}>
                <ThemedText style={[styles.label, { color: colors.textSecondary }]}>
                  Email
                </ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  placeholder="you@example.com"
                  placeholderTextColor={colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                />
              </View>
            </FadeIn>

            <FadeIn delay={250}>
              <View style={styles.inputContainer}>
                <ThemedText style={[styles.label, { color: colors.textSecondary }]}>
                  Password
                </ThemedText>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      styles.passwordInput,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        color: colors.text,
                      },
                    ]}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.textMuted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                  />
                  <Pressable
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}>
                    <IconSymbol
                      name={showPassword ? 'eye.slash' : 'eye'}
                      size={20}
                      color={colors.textMuted}
                    />
                  </Pressable>
                </View>
              </View>
            </FadeIn>
          </View>
        </View>

        <FadeIn delay={350} style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
          <AnimatedPressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.buttonText}>Sign In</ThemedText>
            )}
          </AnimatedPressable>

          <Pressable onPress={() => router.replace('/auth/signup')}>
            <ThemedText style={[styles.linkText, { color: colors.textSecondary }]}>
              Don't have an account?{' '}
              <ThemedText style={{ color: PulseColors.primary }}>Sign up</ThemedText>
            </ThemedText>
          </Pressable>
        </FadeIn>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  footer: {
    paddingHorizontal: 24,
    gap: 16,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    backgroundColor: PulseColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  linkText: {
    fontSize: 15,
  },
});
