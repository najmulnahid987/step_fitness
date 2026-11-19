import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { Spacing } from '@/constants/theme';

export default function FeedScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.content}>
        <ThemedText type="subtitle" style={styles.title}>
          Activity Feed
        </ThemedText>

        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="smallBold" style={styles.cardHeader}>
            Social Activity Feed
          </ThemedText>
          <ThemedText type="default" themeColor="textSecondary" style={styles.cardBody}>
            Follow athlete activities, view running and cycling workouts, give kudos, and share
            outdoor achievements.
          </ThemedText>
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="smallBold" style={styles.cardHeader}>
            Recent Activity
          </ThemedText>
          <ThemedText type="default" style={styles.cardBody}>
            Morning Trail Run — 5.24 km in 28:14
          </ThemedText>
          <Link href="/activity/act-sample-101" style={styles.link} asChild>
            <ThemedText type="linkPrimary">
              View Activity Details (#act-sample-101) &rarr;
            </ThemedText>
          </Link>
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
    marginBottom: Spacing.two,
  },
  link: {
    marginTop: Spacing.one,
  },
});
