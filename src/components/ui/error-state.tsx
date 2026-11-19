import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppText } from '@/components/ui/app-text';
import { Spacing } from '@/constants/theme';

export interface ErrorStateProps {
  title?: string;
  description: string;
  onRetry?: () => void;
  retryTitle?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description,
  onRetry,
  retryTitle = 'Try Again',
  style,
  testID,
}: ErrorStateProps): React.JSX.Element {
  return (
    <View testID={testID} style={[styles.container, style]}>
      <AppText variant="smallHeading" color="error" align="center" style={styles.title}>
        {title}
      </AppText>

      <AppText variant="body" color="secondary" align="center" style={styles.description}>
        {description}
      </AppText>

      {onRetry ? (
        <AppButton
          title={retryTitle}
          onPress={onRetry}
          variant="secondary"
          size="medium"
          style={styles.button}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: Spacing.xs,
  },
  description: {
    marginBottom: Spacing.lg,
    maxWidth: 320,
  },
  button: {
    minWidth: 140,
  },
});
