import { Link, router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { Spacing } from '@/constants/theme';

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isValidId = typeof id === 'string' && id.trim().length > 0;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.content}>
        <ThemedText type="subtitle" style={styles.title}>
          Activity Detail
        </ThemedText>

        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="smallBold" style={styles.cardHeader}>
            Activity Identifier
          </ThemedText>
          <ThemedText type="default" style={styles.idText}>
            {isValidId ? id : 'Unknown or Invalid Activity ID'}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.cardBody}>
            This is a placeholder activity detail screen. Real database queries (SQLite/Supabase),
            route polylines, pace splits, and workout telemetry will be loaded here in Phase 04 and
            Phase 05.
          </ThemedText>
        </ThemedView>

        <View style={styles.actionGroup}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <ThemedText type="smallBold" style={styles.backButtonText}>
              &larr; Back to Previous Screen
            </ThemedText>
          </Pressable>

          <Link href="/(tabs)/feed" style={styles.feedLink}>
            <ThemedText type="link">Return to Feed</ThemedText>
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
  },
  title: {
    marginBottom: Spacing.four,
  },
  card: {
    padding: Spacing.three,
    borderRadius: 12,
    marginBottom: Spacing.four,
  },
  cardHeader: {
    marginBottom: Spacing.one,
  },
  idText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FC5200',
    marginBottom: Spacing.two,
  },
  cardBody: {
    lineHeight: 20,
  },
  actionGroup: {
    gap: Spacing.two,
    alignItems: 'center',
  },
  backButton: {
    width: '100%',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: 10,
    backgroundColor: '#3C87F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  feedLink: {
    paddingVertical: Spacing.two,
  },
});
