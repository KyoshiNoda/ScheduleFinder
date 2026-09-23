import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const resetToken = 'A'.repeat(43);
const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  verifyPasswordReset: vi.fn(),
  completePasswordReset: vi.fn(),
}));

vi.mock('../services/passwordReset', () => ({
  verifyPasswordReset: mocks.verifyPasswordReset,
  completePasswordReset: mocks.completePasswordReset,
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => mocks.navigate };
});

vi.mock('../components/Toggle', () => ({ default: () => <div>Theme toggle</div> }));

import ResetPasswordPage from './ResetPasswordPage';

describe('ResetPasswordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    mocks.verifyPasswordReset.mockResolvedValue({ resetToken, expiresInSeconds: 600 });
    mocks.completePasswordReset.mockResolvedValue(undefined);
  });

  it('redirects a direct visit that has no pending reset email', async () => {
    render(<ResetPasswordPage />);

    await waitFor(() => {
      expect(mocks.navigate).toHaveBeenCalledWith('/forgotPassword', { replace: true });
    });
  });

  it('keeps the proof in component memory and completes the reset', async () => {
    sessionStorage.setItem('passwordResetEmail', 'student@example.invalid');
    render(<ResetPasswordPage />);

    ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'].forEach((id, index) => {
      fireEvent.change(document.getElementById(id) as HTMLInputElement, {
        target: { value: String(index + 1) },
      });
    });
    fireEvent.click(screen.getByRole('button', { name: 'Verify' }));

    expect(await screen.findByRole('heading', { name: 'Reset Password' })).toBeInTheDocument();
    expect(mocks.verifyPasswordReset).toHaveBeenCalledWith(
      'student@example.invalid',
      '123456'
    );
    expect(sessionStorage.getItem('passwordResetEmail')).toBe('student@example.invalid');
    expect(sessionStorage.getItem('resetToken')).toBeNull();

    fireEvent.change(document.getElementById('NewPassword') as HTMLInputElement, {
      target: { value: 'replacement-password' },
    });
    fireEvent.change(document.getElementById('newConfirmedPassword') as HTMLInputElement, {
      target: { value: 'replacement-password' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Reset!' }));

    await waitFor(() => {
      expect(mocks.completePasswordReset).toHaveBeenCalledWith({
        email: 'student@example.invalid',
        resetToken,
        newPassword: 'replacement-password',
        confirmNewPassword: 'replacement-password',
      });
    });
    expect(sessionStorage.getItem('passwordResetEmail')).toBeNull();
    expect(mocks.navigate).toHaveBeenCalledWith('/login');
  });

  it('clears tab state and restarts after an invalid or expired proof', async () => {
    sessionStorage.setItem('passwordResetEmail', 'student@example.invalid');
    mocks.completePasswordReset.mockRejectedValue({
      status: 400,
      code: 'INVALID_RESET_PROOF',
      message: 'Invalid or expired reset proof.',
    });
    render(<ResetPasswordPage />);

    ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'].forEach((id, index) => {
      fireEvent.change(document.getElementById(id) as HTMLInputElement, {
        target: { value: String(index + 1) },
      });
    });
    fireEvent.click(screen.getByRole('button', { name: 'Verify' }));
    await screen.findByRole('heading', { name: 'Reset Password' });

    fireEvent.change(document.getElementById('NewPassword') as HTMLInputElement, {
      target: { value: 'replacement-password' },
    });
    fireEvent.change(document.getElementById('newConfirmedPassword') as HTMLInputElement, {
      target: { value: 'replacement-password' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Reset!' }));

    await waitFor(() => {
      expect(mocks.navigate).toHaveBeenCalledWith('/forgotPassword', { replace: true });
    });
    expect(sessionStorage.getItem('passwordResetEmail')).toBeNull();
  });
});
