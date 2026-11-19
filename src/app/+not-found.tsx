import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { Spacing } from '@/constants/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops! Not Found' }} />
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.content}>
          <ThemedText type="subtitle" style={styles.title}>
            404 — Screen Not Found
          </ThemedText>
          <ThemedText style={styles.description}>
            The screen or route you are looking for does not exist or has been moved.
          </ThemedText>
          <Link href="/(tabs)/feed" style={styles.link}>
            <ThemedText type="linkPrimary">Return to Activity Feed &rarr;</ThemedText>
          </Link>
        </SafeAreaView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: Spacing.two,
    textAlign: 'center',
  },
  description: {
    marginBottom: Spacing.four,
    textAlign: 'center',
  },
  link: {
    marginTop: Spacing.two,
    paddingVertical: Spacing.two,
  },
});
