import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppText } from '@/components/ui/app-text';
import { Spacing } from '@/constants/theme';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionTitle?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function EmptyState({
  title,
  description,
  actionTitle,
  onAction,
  icon,
  style,
  testID,
}: EmptyStateProps): React.JSX.Element {
  return (
    <View testID={testID} style={[styles.container, style]}>
      {icon ? <View style={styles.iconContainer}>{icon}</View> : null}

      <AppText variant="smallHeading" color="primary" align="center" style={styles.title}>
        {title}
      </AppText>

      <AppText variant="body" color="secondary" align="center" style={styles.description}>
        {description}
      </AppText>

      {actionTitle && onAction ? (
        <AppButton
          title={actionTitle}
          onPress={onAction}
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
  iconContainer: {
    marginBottom: Spacing.md,
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
