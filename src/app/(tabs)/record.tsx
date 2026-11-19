import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { Spacing } from '@/constants/theme';

export default function RecordScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.content}>
        <ThemedText type="subtitle" style={styles.title}>
          Record Activity
        </ThemedText>

        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="smallBold" style={styles.cardHeader}>
            GPS & Sensor Tracking
          </ThemedText>
          <ThemedText type="default" themeColor="textSecondary" style={styles.cardBody}>
            Real-time GPS tracking for running, cycling, and hiking activities. Distance, pace,
            elevation gain, and elapsed time recording will be introduced in Phase 04.
          </ThemedText>
        </ThemedView>

        <View style={styles.buttonContainer}>
          <Pressable
            disabled
            accessibilityRole="button"
            accessibilityState={{ disabled: true }}
            style={({ pressed }) => [
              styles.recordButton,
              styles.disabledButton,
              pressed && styles.pressedButton,
            ]}
          >
            <ThemedText type="smallBold" style={styles.recordButtonText}>
              Start Recording (Disabled in Phase 01)
            </ThemedText>
          </Pressable>
          <ThemedText type="small" themeColor="textSecondary" style={styles.helperText}>
            GPS tracking, pedometer sensors, and background location services will be enabled in
            Phase 04.
          </ThemedText>
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
    marginBottom: Spacing.five,
  },
  cardHeader: {
    marginBottom: Spacing.one,
  },
  cardBody: {
    lineHeight: 22,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: Spacing.three,
  },
  recordButton: {
    width: '100%',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#8E8E93',
    opacity: 0.6,
  },
  pressedButton: {
    opacity: 0.4,
  },
  recordButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  helperText: {
    marginTop: Spacing.two,
    textAlign: 'center',
  },
});
