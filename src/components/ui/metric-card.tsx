import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppCard, type AppCardVariant } from '@/components/ui/app-card';
import { AppText } from '@/components/ui/app-text';
import { Spacing } from '@/constants/theme';

export interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  variant?: AppCardVariant;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function MetricCard({
  label,
  value,
  unit,
  icon,
  variant = 'default',
  style,
  testID,
}: MetricCardProps): React.JSX.Element {
  return (
    <AppCard testID={testID} variant={variant} padding="md" style={[styles.card, style]}>
      <View style={styles.header}>
        <AppText variant="caption" color="secondary" weight="600" style={styles.label}>
          {label.toUpperCase()}
        </AppText>
        {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
      </View>

      <View style={styles.valueRow}>
        <AppText variant="largeHeading" color="primary" weight="700">
          {value}
        </AppText>
        {unit ? (
          <AppText variant="supporting" color="secondary" weight="500" style={styles.unit}>
            {unit}
          </AppText>
        ) : null}
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    minWidth: 120,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  label: {
    letterSpacing: 0.5,
  },
  iconContainer: {
    marginLeft: Spacing.xs,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  unit: {
    marginLeft: Spacing.xxs,
  },
});
