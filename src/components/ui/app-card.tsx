import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { BorderRadius, BorderWidth, Palette, Shadows, Spacing } from '@/constants/theme';

export type AppCardVariant = 'default' | 'subtle' | 'outlined';
export type AppCardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface AppCardProps extends ViewProps {
  variant?: AppCardVariant;
  padding?: AppCardPadding;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export function AppCard({
  variant = 'default',
  padding = 'md',
  style,
  children,
  ...rest
}: AppCardProps): React.JSX.Element {
  return (
    <View style={[styles.base, styles[variant], paddingStyles[padding], style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  default: {
    backgroundColor: Palette.surface,
    borderWidth: BorderWidth.thin,
    borderColor: Palette.border,
    ...Shadows.subtle,
  },
  subtle: {
    backgroundColor: Palette.mutedSurface,
    borderWidth: 0,
    ...Shadows.none,
  },
  outlined: {
    backgroundColor: Palette.surface,
    borderWidth: BorderWidth.thin,
    borderColor: Palette.border,
    ...Shadows.none,
  },
});

const paddingStyles = StyleSheet.create({
  none: {
    padding: 0,
  },
  sm: {
    padding: Spacing.xs,
  },
  md: {
    padding: Spacing.md,
  },
  lg: {
    padding: Spacing.xl,
  },
});
