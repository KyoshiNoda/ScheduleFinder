import { createRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import ChangePasswordModal from './ChangePasswordModal';

vi.mock('../../utils/functions', () => ({
  useEscapeKey: vi.fn(),
}));

const renderModal = (overrides = {}) => {
  const props = {
    state: true,
    setState: vi.fn(),
    currentPasswordRef: createRef<HTMLInputElement>(),
    newPasswordRef: createRef<HTMLInputElement>(),
    newConfirmedPasswordRef: createRef<HTMLInputElement>(),
    isCurrentPasswordError: false,
    isNewPasswordError: false,
    errorMessage: '',
    passwordHandler: vi.fn(),
    ...overrides,
  };

  render(<ChangePasswordModal {...props} />);
  return props;
};

describe('ChangePasswordModal', () => {
  it('renders password inputs when open', () => {
    renderModal();

    expect(screen.getByRole('heading', { name: 'Reset Password' })).toBeInTheDocument();
    expect(document.getElementById('currentPassword')).toBeInTheDocument();
    expect(document.getElementById('newPassword')).toBeInTheDocument();
    expect(document.getElementById('newConfirmedPassword')).toBeInTheDocument();
  });

  it('calls the password handler from the reset button', () => {
    const props = renderModal();

    fireEvent.click(screen.getByRole('button', { name: 'Reset Password' }));

    expect(props.passwordHandler).toHaveBeenCalledTimes(1);
  });

  it('shows current password errors', () => {
    renderModal({
      isCurrentPasswordError: true,
      errorMessage: 'Incorrect current password',
    });

    expect(screen.getByText('Incorrect current password')).toBeInTheDocument();
  });

  it('shows new password errors next to both new password fields', () => {
    renderModal({
      isNewPasswordError: true,
      errorMessage: 'Passwords must match',
    });

    expect(screen.getAllByText('Passwords must match')).toHaveLength(2);
  });
});
