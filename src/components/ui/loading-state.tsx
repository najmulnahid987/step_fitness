import React from 'react';
import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Palette, Spacing } from '@/constants/theme';

export interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'large';
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function LoadingState({
  message,
  size = 'small',
  style,
  testID,
}: LoadingStateProps): React.JSX.Element {
  return (
    <View testID={testID} style={[styles.container, style]}>
      <ActivityIndicator size={size} color={Palette.primary} />
      {message ? (
        <AppText variant="supporting" color="secondary" align="center" style={styles.message}>
          {message}
        </AppText>
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
  message: {
    marginTop: Spacing.sm,
  },
});
