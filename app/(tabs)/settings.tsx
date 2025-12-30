import { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AnimatedPressable } from '@/components/ui/animated-pressable';
import { FadeIn } from '@/components/ui/fade-in';
import { PulseColors, SemanticColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/auth-context';
import { logOut } from '@/services/auth';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? PulseColors.dark : PulseColors.light;
  const insets = useSafeAreaInsets();
  const { user, userData, isAdmin } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          setSigningOut(true);
          try {
            await logOut();
            router.replace('/auth');
          } catch (error) {
            Alert.alert('Error', 'Failed to sign out');
          } finally {
            setSigningOut(false);
          }
        },
      },
    ]);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 20 },
        ]}>
        <FadeIn delay={0}>
          <ThemedText type="title" style={styles.title}>
            Settings
          </ThemedText>
        </FadeIn>

        {/* Profile Section */}
        <FadeIn delay={50}>
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <View style={styles.profileHeader}>
              <View
                style={[styles.avatar, { backgroundColor: PulseColors.primary }]}>
                <ThemedText style={styles.avatarText}>
                  {userData?.displayName?.charAt(0).toUpperCase() ||
                    user?.email?.charAt(0).toUpperCase() ||
                    '?'}
                </ThemedText>
              </View>
              <View style={styles.profileInfo}>
                <ThemedText style={styles.profileName}>
                  {userData?.displayName || 'User'}
                </ThemedText>
                <ThemedText
                  style={[styles.profileEmail, { color: colors.textSecondary }]}>
                  {user?.email}
                </ThemedText>
                {isAdmin && (
                  <View style={styles.adminBadge}>
                    <ThemedText style={styles.adminBadgeText}>Admin</ThemedText>
                  </View>
                )}
              </View>
            </View>
          </View>
        </FadeIn>

        {/* Appearance Section */}
        <FadeIn delay={100}>
          <View style={styles.sectionHeader}>
            <ThemedText
              style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              APPEARANCE
            </ThemedText>
          </View>
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <IconSymbol
                  name={isDark ? 'moon.fill' : 'sun.max.fill'}
                  size={22}
                  color={PulseColors.primary}
                />
                <ThemedText style={styles.settingLabel}>Theme</ThemedText>
              </View>
              <ThemedText style={[styles.settingValue, { color: colors.textSecondary }]}>
                {isDark ? 'Dark' : 'Light'}
              </ThemedText>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <ThemedText style={[styles.settingNote, { color: colors.textMuted }]}>
              Theme follows your system settings. Change in device Settings.
            </ThemedText>
          </View>
        </FadeIn>

        {/* Notifications Section */}
        <FadeIn delay={150}>
          <View style={styles.sectionHeader}>
            <ThemedText
              style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              NOTIFICATIONS
            </ThemedText>
          </View>
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <IconSymbol
                  name="bell.fill"
                  size={22}
                  color={PulseColors.primary}
                />
                <ThemedText style={styles.settingLabel}>
                  Push Notifications
                </ThemedText>
              </View>
              <Switch
                value={userData?.settings?.notificationsEnabled ?? true}
                trackColor={{
                  false: colors.border,
                  true: PulseColors.primary,
                }}
                thumbColor="#fff"
                disabled
              />
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <ThemedText style={[styles.settingNote, { color: colors.textMuted }]}>
              Receive daily briefing notifications at 7:30, 13:30, and 20:30.
            </ThemedText>
          </View>
        </FadeIn>

        {/* About Section */}
        <FadeIn delay={200}>
          <View style={styles.sectionHeader}>
            <ThemedText
              style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              ABOUT
            </ThemedText>
          </View>
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <IconSymbol
                  name="info.circle.fill"
                  size={22}
                  color={PulseColors.primary}
                />
                <ThemedText style={styles.settingLabel}>Version</ThemedText>
              </View>
              <ThemedText style={[styles.settingValue, { color: colors.textSecondary }]}>
                1.0.0
              </ThemedText>
            </View>
          </View>
        </FadeIn>

        {/* Sign Out Button */}
        <FadeIn delay={250}>
          <AnimatedPressable
            style={[styles.signOutButton, { backgroundColor: colors.surface }]}
            onPress={handleSignOut}
            disabled={signingOut}>
            {signingOut ? (
              <ActivityIndicator color={SemanticColors.error} />
            ) : (
              <>
                <IconSymbol
                  name="rectangle.portrait.and.arrow.right"
                  size={22}
                  color={SemanticColors.error}
                />
                <ThemedText style={[styles.signOutText, { color: SemanticColors.error }]}>
                  Sign Out
                </ThemedText>
              </>
            )}
          </AnimatedPressable>
        </FadeIn>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 24,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
  },
  profileEmail: {
    fontSize: 14,
    marginTop: 2,
  },
  adminBadge: {
    backgroundColor: PulseColors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  adminBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 16,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 12,
  },
  settingNote: {
    fontSize: 13,
    lineHeight: 18,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
