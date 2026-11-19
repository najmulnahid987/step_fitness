import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppCard } from '@/components/ui/app-card';
import { AppText } from '@/components/ui/app-text';
import { Palette, Spacing } from '@/constants/theme';

export interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  description: string;
  confirmTitle?: string;
  cancelTitle?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  testID?: string;
}

export function ConfirmDialog({
  visible,
  title,
  description,
  confirmTitle = 'Confirm',
  cancelTitle = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
  testID,
}: ConfirmDialogProps): React.JSX.Element {
  return (
    <Modal
      testID={testID}
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      accessibilityRole="alert"
    >
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.contentWrapper} onPress={(e) => e.stopPropagation()}>
          <AppCard variant="default" padding="lg" style={styles.dialogCard}>
            <AppText variant="smallHeading" color="primary" style={styles.title}>
              {title}
            </AppText>

            <AppText variant="body" color="secondary" style={styles.description}>
              {description}
            </AppText>

            <View style={styles.actions}>
              <AppButton
                title={cancelTitle}
                onPress={onCancel}
                variant="ghost"
                size="medium"
                style={styles.actionButton}
              />
              <AppButton
                title={confirmTitle}
                onPress={onConfirm}
                variant={isDestructive ? 'destructive' : 'primary'}
                size="medium"
                style={styles.actionButton}
              />
            </View>
          </AppCard>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: Palette.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 400,
  },
  dialogCard: {
    width: '100%',
  },
  title: {
    marginBottom: Spacing.xs,
  },
  description: {
    marginBottom: Spacing.xl,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
  },
  actionButton: {
    minWidth: 100,
  },
});
