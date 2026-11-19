import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { Spacing } from '@/constants/theme';

export default function ProfileScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.content}>
        <ThemedText type="subtitle" style={styles.title}>
          Athlete Profile
        </ThemedText>

        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="smallBold" style={styles.cardHeader}>
            Athlete Information
          </ThemedText>
          <ThemedText type="default" themeColor="textSecondary" style={styles.cardBody}>
            Manage athlete bio, gear locker (shoes, bikes), personal privacy settings, and activity
            history.
          </ThemedText>
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="smallBold" style={styles.cardHeader}>
            Account Access
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.cardBody}>
            Access authentication workflows:
          </ThemedText>
          <View style={styles.authLinks}>
            <Link href="/(auth)/sign-in" style={styles.link}>
              <ThemedText type="linkPrimary">Go to Sign In &rarr;</ThemedText>
            </Link>
            <Link href="/(auth)/sign-up" style={styles.link}>
              <ThemedText type="linkPrimary">Create New Account &rarr;</ThemedText>
            </Link>
          </View>
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.four,
  },
  title: {
    marginBottom: Spacing.four,
  },
  card: {
    padding: Spacing.three,
    borderRadius: 12,
    marginBottom: Spacing.three,
  },
  cardHeader: {
    marginBottom: Spacing.one,
  },
  cardBody: {
    lineHeight: 20,
    marginBottom: Spacing.two,
  },
  authLinks: {
    gap: Spacing.one,
  },
  link: {
    paddingVertical: Spacing.one,
  },
});
