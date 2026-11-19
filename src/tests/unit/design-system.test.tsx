import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';

import {
  AppButton,
  AppCard,
  AppText,
  AppTextInput,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  LoadingState,
  MetricCard,
} from '@/components/ui';

describe('Design System UI Components', () => {
  describe('AppText', () => {
    it('renders body text by default', async () => {
      await render(<AppText>Standard Body Text</AppText>);
      expect(screen.getByText('Standard Body Text')).toBeTruthy();
    });

    it('renders different typography variants correctly', async () => {
      await render(
        <>
          <AppText variant="display">32 Display</AppText>
          <AppText variant="largeHeading">28 Large Heading</AppText>
          <AppText variant="sectionHeading">24 Section Heading</AppText>
          <AppText variant="smallHeading">20 Small Heading</AppText>
          <AppText variant="bodyEmphasis">18 Body Emphasis</AppText>
          <AppText variant="supporting">14 Supporting Text</AppText>
          <AppText variant="caption">12 Caption Text</AppText>
          <AppText variant="label">14 Label Text</AppText>
        </>,
      );

      expect(screen.getByText('32 Display')).toBeTruthy();
      expect(screen.getByText('28 Large Heading')).toBeTruthy();
      expect(screen.getByText('24 Section Heading')).toBeTruthy();
      expect(screen.getByText('20 Small Heading')).toBeTruthy();
      expect(screen.getByText('18 Body Emphasis')).toBeTruthy();
      expect(screen.getByText('14 Supporting Text')).toBeTruthy();
      expect(screen.getByText('12 Caption Text')).toBeTruthy();
      expect(screen.getByText('14 Label Text')).toBeTruthy();
    });

    it('renders customized colors and text alignment', async () => {
      await render(
        <AppText color="brand" align="center">
          Teal Brand Text
        </AppText>,
      );
      expect(screen.getByText('Teal Brand Text')).toBeTruthy();
    });
  });

  describe('AppButton', () => {
    it('renders all visual variants', async () => {
      await render(
        <>
          <AppButton title="Primary Button" variant="primary" />
          <AppButton title="Secondary Button" variant="secondary" />
          <AppButton title="Ghost Button" variant="ghost" />
          <AppButton title="Destructive Button" variant="destructive" />
        </>,
      );

      expect(screen.getByText('Primary Button')).toBeTruthy();
      expect(screen.getByText('Secondary Button')).toBeTruthy();
      expect(screen.getByText('Ghost Button')).toBeTruthy();
      expect(screen.getByText('Destructive Button')).toBeTruthy();
    });

    it('fires onPress callback on user tap', async () => {
      const onPressMock = jest.fn();
      await render(<AppButton title="Click Me" onPress={onPressMock} />);

      fireEvent.press(screen.getByRole('button', { name: 'Click Me' }));
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('disables interaction when disabled=true', async () => {
      const onPressMock = jest.fn();
      await render(<AppButton title="Disabled Action" disabled onPress={onPressMock} />);

      const button = screen.getByRole('button', { name: 'Disabled Action' });
      fireEvent.press(button);

      expect(onPressMock).not.toHaveBeenCalled();
      expect(button.props.accessibilityState.disabled).toBe(true);
    });

    it('displays loading state and disables interaction', async () => {
      const onPressMock = jest.fn();
      await render(
        <AppButton title="Loading Action" loading onPress={onPressMock} testID="loading-btn" />,
      );

      const button = screen.getByTestId('loading-btn');
      fireEvent.press(button);

      expect(onPressMock).not.toHaveBeenCalled();
      expect(button.props.accessibilityState.busy).toBe(true);
    });
  });

  describe('AppCard', () => {
    it('renders child content and respects variants', async () => {
      await render(
        <AppCard testID="test-card" variant="outlined" padding="lg">
          <AppText>Card Interior</AppText>
        </AppCard>,
      );

      expect(screen.getByTestId('test-card')).toBeTruthy();
      expect(screen.getByText('Card Interior')).toBeTruthy();
    });
  });

  describe('AppTextInput', () => {
    it('displays label, placeholder, and helper text', async () => {
      await render(
        <AppTextInput
          label="Activity Name"
          placeholder="e.g. Morning Jog"
          helperText="Give your workout a descriptive title"
        />,
      );

      expect(screen.getByText('Activity Name')).toBeTruthy();
      expect(screen.getByPlaceholderText('e.g. Morning Jog')).toBeTruthy();
      expect(screen.getByText('Give your workout a descriptive title')).toBeTruthy();
    });

    it('displays error message when provided', async () => {
      await render(
        <AppTextInput
          label="Pace"
          placeholder="0:00"
          errorMessage="Pace must be a positive number"
        />,
      );

      expect(screen.getByText('Pace must be a positive number')).toBeTruthy();
    });

    it('handles text changes correctly', async () => {
      const onChangeMock = jest.fn();
      await render(
        <AppTextInput placeholder="Type here" onChangeText={onChangeMock} testID="sample-input" />,
      );

      fireEvent.changeText(screen.getByTestId('sample-input'), '5.2 km');
      expect(onChangeMock).toHaveBeenCalledWith('5.2 km');
    });

    it('respects disabled state', async () => {
      await render(<AppTextInput placeholder="Cannot edit" disabled testID="disabled-input" />);

      const input = screen.getByTestId('disabled-input');
      expect(input.props.editable).toBe(false);
      expect(input.props.accessibilityState.disabled).toBe(true);
    });
  });

  describe('MetricCard', () => {
    it('renders label, formatted value, and measurement unit', async () => {
      await render(<MetricCard label="Distance" value="12.45" unit="km" testID="dist-card" />);

      expect(screen.getByTestId('dist-card')).toBeTruthy();
      expect(screen.getByText('DISTANCE')).toBeTruthy();
      expect(screen.getByText('12.45')).toBeTruthy();
      expect(screen.getByText('km')).toBeTruthy();
    });
  });

  describe('LoadingState', () => {
    it('renders indicator and optional message', async () => {
      await render(<LoadingState message="Fetching route telemetry..." testID="loading-state" />);

      expect(screen.getByTestId('loading-state')).toBeTruthy();
      expect(screen.getByText('Fetching route telemetry...')).toBeTruthy();
    });
  });

  describe('ErrorState', () => {
    it('renders error title, message, and triggers retry callback', async () => {
      const onRetryMock = jest.fn();
      await render(
        <ErrorState
          title="GPS Signal Lost"
          description="Unable to acquire satellite lock. Please check location settings."
          onRetry={onRetryMock}
          retryTitle="Retry GPS Lock"
        />,
      );

      expect(screen.getByText('GPS Signal Lost')).toBeTruthy();
      expect(
        screen.getByText('Unable to acquire satellite lock. Please check location settings.'),
      ).toBeTruthy();

      const retryBtn = screen.getByRole('button', { name: 'Retry GPS Lock' });
      fireEvent.press(retryBtn);
      expect(onRetryMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('EmptyState', () => {
    it('renders heading, description, and action button', async () => {
      const onActionMock = jest.fn();
      await render(
        <EmptyState
          title="No Activities Yet"
          description="Record your first run or ride to start tracking your outdoor fitness."
          actionTitle="Record Workout"
          onAction={onActionMock}
        />,
      );

      expect(screen.getByText('No Activities Yet')).toBeTruthy();
      expect(
        screen.getByText('Record your first run or ride to start tracking your outdoor fitness.'),
      ).toBeTruthy();

      const actionBtn = screen.getByRole('button', { name: 'Record Workout' });
      fireEvent.press(actionBtn);
      expect(onActionMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('ConfirmDialog', () => {
    it('calls onCancel when cancel button is pressed', async () => {
      const onCancelMock = jest.fn();

      await render(
        <ConfirmDialog
          visible={true}
          title="Discard Workout?"
          description="Unsaved progress will be lost."
          cancelTitle="Keep Editing"
          onConfirm={jest.fn()}
          onCancel={onCancelMock}
          testID="discard-dialog"
        />,
      );

      expect(screen.getByText('Discard Workout?')).toBeTruthy();
      expect(screen.getByText('Unsaved progress will be lost.')).toBeTruthy();

      const cancelBtn = screen.getByRole('button', { name: 'Keep Editing' });
      fireEvent.press(cancelBtn);
      expect(onCancelMock).toHaveBeenCalledTimes(1);
    });

    it('calls onConfirm when confirm button is pressed', async () => {
      const onConfirmMock = jest.fn();

      await render(
        <ConfirmDialog
          visible={true}
          title="Delete Activity"
          description="Permanently delete this activity record."
          confirmTitle="Delete"
          isDestructive={true}
          onConfirm={onConfirmMock}
          onCancel={jest.fn()}
        />,
      );

      const confirmBtn = screen.getByRole('button', { name: 'Delete' });
      fireEvent.press(confirmBtn);
      expect(onConfirmMock).toHaveBeenCalledTimes(1);
    });
  });
});
