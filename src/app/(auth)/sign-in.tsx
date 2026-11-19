import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { Spacing } from '@/constants/theme';

export default function SignInScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.content}>
        <ThemedText type="subtitle" style={styles.title}>
          Sign In
        </ThemedText>

        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="smallBold" style={styles.cardHeader}>
            Phase 01 Navigation Shell
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.cardBody}>
            Authentication and user session management (Supabase / OAuth) will be implemented in
            Phase 03. This is an architectural navigation placeholder.
          </ThemedText>
        </ThemedView>

        <View style={styles.linkGroup}>
          <Link href="/(auth)/sign-up" style={styles.link} asChild>
            <ThemedText type="linkPrimary">Don&apos;t have an account? Sign Up</ThemedText>
          </Link>
          <Link href="/(auth)/forgot-password" style={styles.link} asChild>
            <ThemedText type="link">Forgot Password?</ThemedText>
          </Link>
          <Link href="/(tabs)/feed" style={styles.link} asChild>
            <ThemedText type="link">Back to Feed</ThemedText>
          </Link>
        </View>
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
    justifyContent: 'center',
  },
  title: {
    marginBottom: Spacing.four,
    textAlign: 'center',
  },
  card: {
    padding: Spacing.three,
    borderRadius: 12,
    marginBottom: Spacing.four,
  },
  cardHeader: {
    marginBottom: Spacing.one,
  },
  cardBody: {
    lineHeight: 20,
  },
  linkGroup: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  link: {
    paddingVertical: Spacing.one,
  },
});
