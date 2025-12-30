import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider, Theme } from '@react-navigation/native';
import { Stack, router, useSegments, useRootNavigationState } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { PulseColors } from '@/constants/theme';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import {
  registerForPushNotifications,
  addNotificationResponseListener,
  getLastNotificationResponse,
} from '@/services/notifications';

export const unstable_settings = {
  anchor: '(tabs)',
};

// Custom theme based on Pulse design system
const PulseLightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: PulseColors.primary,
    background: PulseColors.light.background,
    card: PulseColors.light.surface,
    text: PulseColors.light.text,
    border: PulseColors.light.border,
  },
};

const PulseDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: PulseColors.primary,
    background: PulseColors.dark.background,
    card: PulseColors.dark.surface,
    text: PulseColors.dark.text,
    border: PulseColors.dark.border,
  },
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user, loading } = useAuth();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!loading) {
      if (!user && !inAuthGroup) {
        // Redirect to auth if not logged in and not already on auth screen
        router.replace('/auth');
      } else if (user && inAuthGroup) {
        // Redirect to home if logged in and on auth screen
        router.replace('/(tabs)');
      }
    }
  }, [user, loading, segments, navigationState?.key]);

  useEffect(() => {
    // Only register for push notifications if user is logged in
    if (!user) return;

    registerForPushNotifications().then((token) => {
      if (token) {
        // Log the token - you'll need this to add to GitHub Secrets
        console.log('='.repeat(60));
        console.log('EXPO PUSH TOKEN (add to GitHub Secrets as EXPO_PUSH_TOKEN):');
        console.log(token);
        console.log('='.repeat(60));
      }
    });

    // Handle notification taps
    const subscription = addNotificationResponseListener((response) => {
      const data = response.notification.request.content.data;
      if (data?.screen === 'today') {
        router.push('/(tabs)');
      } else if (data?.briefingId) {
        router.push(`/briefing/${data.briefingId}`);
      }
    });

    // Check if app was opened from a notification
    getLastNotificationResponse().then((response) => {
      if (response) {
        const data = response.notification.request.content.data;
        if (data?.screen === 'today') {
          router.push('/(tabs)');
        }
      }
    });

    return () => subscription.remove();
  }, [user]);

  // Show loading screen while checking auth state
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colorScheme === 'dark' ? PulseColors.dark.background : PulseColors.light.background }}>
        <ActivityIndicator size="large" color={PulseColors.primary} />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? PulseDarkTheme : PulseLightTheme}>
      <Stack>
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="briefing/[id]"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="item/[id]"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="modal"
          options={{
            presentation: 'modal',
            title: 'Modal',
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
