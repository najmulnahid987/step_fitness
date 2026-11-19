import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { AppText } from '@/components/ui/app-text';
import {
  BorderRadius,
  BorderWidth,
  Palette,
  Spacing,
  TouchTarget,
  Typography,
} from '@/constants/theme';

export interface AppTextInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
}

export function AppTextInput({
  label,
  helperText,
  errorMessage,
  disabled = false,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  containerStyle,
  inputStyle,
  onFocus,
  onBlur,
  testID,
  accessibilityLabel,
  ...rest
}: AppTextInputProps): React.JSX.Element {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus: TextInputProps['onFocus'] = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur: TextInputProps['onBlur'] = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const hasError = Boolean(errorMessage);

  const getBorderColor = () => {
    if (hasError) return Palette.error;
    if (isFocused) return Palette.borderFocused;
    return Palette.border;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <AppText variant="label" color={hasError ? 'error' : 'secondary'} style={styles.label}>
          {label}
        </AppText>
      ) : null}

      <View
        style={[
          styles.inputWrapper,
          {
            borderColor: getBorderColor(),
            backgroundColor: disabled ? Palette.disabledBackground : Palette.surface,
          },
        ]}
      >
        <TextInput
          testID={testID}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Palette.tertiaryText}
          editable={!disabled}
          secureTextEntry={secureTextEntry}
          onFocus={handleFocus}
          onBlur={handleBlur}
          accessibilityLabel={accessibilityLabel || label || placeholder}
          accessibilityState={{ disabled }}
          style={[
            styles.input,
            { color: disabled ? Palette.disabledText : Palette.mainText },
            inputStyle,
          ]}
          {...rest}
        />
      </View>

      {hasError ? (
        <AppText variant="caption" color="error" style={styles.message}>
          {errorMessage}
        </AppText>
      ) : helperText ? (
        <AppText variant="caption" color="secondary" style={styles.message}>
          {helperText}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: Spacing.xs,
  },
  label: {
    marginBottom: Spacing.xxs,
  },
  inputWrapper: {
    minHeight: TouchTarget.min,
    borderWidth: BorderWidth.thin,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm,
  },
  input: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
    paddingVertical: Spacing.xs,
  },
  message: {
    marginTop: Spacing.xxs,
  },
});
