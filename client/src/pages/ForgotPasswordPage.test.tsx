import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  requestPasswordReset: vi.fn(),
}));

vi.mock('../services/passwordReset', () => ({
  requestPasswordReset: mocks.requestPasswordReset,
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => mocks.navigate };
});

vi.mock('../components/Toggle', () => ({ default: () => <div>Theme toggle</div> }));

import ForgotPasswordPage from './ForgotPasswordPage';

describe('ForgotPasswordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    mocks.requestPasswordReset.mockResolvedValue(undefined);
  });

  it('makes one generic reset request and stores only the email in session storage', async () => {
    render(<ForgotPasswordPage />);

    fireEvent.change(screen.getByPlaceholderText('johndoe@gmail.com'), {
      target: { value: ' student@example.invalid ' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send Email' }));

    await waitFor(() => {
      expect(mocks.requestPasswordReset).toHaveBeenCalledWith(
        ' student@example.invalid '
      );
    });
    expect(sessionStorage.getItem('passwordResetEmail')).toBe('student@example.invalid');
    expect(mocks.navigate).toHaveBeenCalledWith('/resetPassword');
  });
});
