import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { BorderRadius, Palette, Spacing, TouchTarget } from '@/constants/theme';

export type AppButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type AppButtonSize = 'small' | 'medium' | 'large';

export interface AppButtonProps {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  accessibilityLabel?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  accessibilityLabel,
  testID,
  style,
}: AppButtonProps): React.JSX.Element {
  const isInteractive = !disabled && !loading;

  const getBackgroundColor = (pressed: boolean) => {
    if (!isInteractive) return Palette.disabledBackground;
    switch (variant) {
      case 'primary':
        return pressed ? Palette.primaryPressed : Palette.primary;
      case 'secondary':
        return pressed ? '#D2E6E3' : Palette.primarySubtle;
      case 'destructive':
        return pressed ? '#963838' : Palette.error;
      case 'ghost':
        return pressed ? Palette.mutedSurface : 'transparent';
    }
  };

  const getTextColor = () => {
    if (!isInteractive) return 'secondary';
    switch (variant) {
      case 'primary':
      case 'destructive':
        return 'white';
      case 'secondary':
        return 'brand';
      case 'ghost':
        return 'primary';
    }
  };

  const getIndicatorColor = () => {
    if (!isInteractive) return Palette.disabledText;
    switch (variant) {
      case 'primary':
      case 'destructive':
        return Palette.white;
      case 'secondary':
        return Palette.primary;
      case 'ghost':
        return Palette.mainText;
    }
  };

  const textVariant = size === 'small' ? 'supporting' : size === 'large' ? 'bodyEmphasis' : 'body';

  return (
    <Pressable
      testID={testID}
      disabled={!isInteractive}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: !isInteractive, busy: loading }}
      hitSlop={size === 'small' ? { top: 4, bottom: 4, left: 4, right: 4 } : undefined}
      style={({ pressed }) => [
        styles.base,
        styles[size],
        variant === 'ghost' && styles.ghostBorder,
        { backgroundColor: getBackgroundColor(pressed) },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getIndicatorColor()} />
      ) : (
        <>
          {icon}
          <AppText
            variant={textVariant}
            color={getTextColor()}
            weight="600"
            align="center"
            style={icon ? styles.textWithIcon : undefined}
          >
            {title}
          </AppText>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
    minHeight: TouchTarget.min,
  },
  small: {
    height: 36,
    paddingHorizontal: Spacing.sm,
  },
  medium: {
    height: TouchTarget.min,
    paddingHorizontal: Spacing.md,
  },
  large: {
    height: 52,
    paddingHorizontal: Spacing.lg,
  },
  ghostBorder: {
    borderWidth: 1,
    borderColor: Palette.border,
  },
  textWithIcon: {
    marginLeft: Spacing.xs,
  },
});
