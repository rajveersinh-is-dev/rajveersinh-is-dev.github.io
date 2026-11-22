import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

const ProblemChild = () => {
  throw new Error('Test intentional rendering failure');
};

describe('ErrorBoundary Component', () => {
  it('catches runtime component errors and renders recovery interface without blanking screen', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Computational Kernel Exception/i)).toBeTruthy();
    expect(screen.getByText(/Test intentional rendering failure/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /Reload Archive/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Reset Preferences & Cache/i })).toBeTruthy();

    consoleSpy.mockRestore();
  });
});
