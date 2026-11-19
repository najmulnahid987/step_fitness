import { render, screen } from '@testing-library/react-native';

import { ThemedText } from '@/components/ui/themed-text';

describe('ThemedText Component', () => {
  it('renders child text content correctly', async () => {
    await render(<ThemedText>Morning Run 5K</ThemedText>);
    expect(screen.getByText('Morning Run 5K')).toBeTruthy();
  });

  it('renders different typography variants', async () => {
    await render(<ThemedText type="subtitle">Explore Trails</ThemedText>);
    expect(screen.getByText('Explore Trails')).toBeTruthy();
  });
});
