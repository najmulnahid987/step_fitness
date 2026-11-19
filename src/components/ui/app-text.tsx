import React from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';

import { Palette, Typography, type TypographyVariant } from '@/constants/theme';

export type AppTextColor =
  'primary' | 'secondary' | 'tertiary' | 'brand' | 'error' | 'success' | 'warning' | 'white';

export type AppTextVariant = TypographyVariant | 'label';

export interface AppTextProps extends TextProps {
  variant?: AppTextVariant;
  color?: AppTextColor;
  align?: 'left' | 'center' | 'right';
  weight?: '400' | '500' | '600' | '700';
  children?: React.ReactNode;
}

const colorMap: Record<AppTextColor, string> = {
  primary: Palette.mainText,
  secondary: Palette.secondaryText,
  tertiary: Palette.tertiaryText,
  brand: Palette.primary,
  error: Palette.error,
  success: Palette.success,
  warning: Palette.warning,
  white: Palette.white,
};

export function AppText({
  variant = 'body',
  color = 'primary',
  align = 'left',
  weight,
  style,
  children,
  ...rest
}: AppTextProps): React.JSX.Element {
  const typographyStyle = variant === 'label' ? styles.label : Typography[variant];

  return (
    <Text
      style={[
        styles.base,
        typographyStyle,
        { color: colorMap[color], textAlign: align },
        weight ? { fontWeight: weight } : null,
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
  label: {
    fontSize: Typography.supporting.fontSize,
    lineHeight: Typography.supporting.lineHeight,
    fontWeight: '600',
  },
});
