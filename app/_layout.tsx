import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider, Theme } from '@react-navigation/native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { PulseColors } from '@/constants/theme';
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

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Register for push notifications
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
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? PulseDarkTheme : PulseLightTheme}>
      <Stack>
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
