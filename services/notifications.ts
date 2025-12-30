import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Register for push notifications and get the Expo push token
 * @returns The Expo push token or null if registration fails
 */
export async function registerForPushNotifications(): Promise<string | null> {
  // Push notifications only work on physical devices
  if (!Device.isDevice) {
    console.log('[Notifications] Must use physical device for push notifications');
    return null;
  }

  // Check/request permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('[Notifications] Permission not granted');
    return null;
  }

  // Get the project ID from app config
  const projectId = Constants.expoConfig?.extra?.eas?.projectId;

  if (!projectId) {
    console.log('[Notifications] No EAS project ID found');
    // For development, we can still get a token without projectId
  }

  try {
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: projectId,
    });

    const token = tokenData.data;
    console.log('[Notifications] Push token:', token);

    // On Android, we need to set up a notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2b8cee',
      });
    }

    return token;
  } catch (error) {
    console.error('[Notifications] Error getting push token:', error);
    return null;
  }
}

/**
 * Add a listener for when a notification is received while the app is foregrounded
 */
export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void
) {
  return Notifications.addNotificationReceivedListener(callback);
}

/**
 * Add a listener for when a user taps on a notification
 */
export function addNotificationResponseListener(
  callback: (response: Notifications.NotificationResponse) => void
) {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

/**
 * Get the notification response that opened the app (if any)
 */
export async function getLastNotificationResponse() {
  return Notifications.getLastNotificationResponseAsync();
}

/**
 * Schedule a local notification (for testing)
 */
export async function scheduleLocalNotification(
  title: string,
  body: string,
  data?: Record<string, unknown>
) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
    },
    trigger: null, // Immediate
  });
}
