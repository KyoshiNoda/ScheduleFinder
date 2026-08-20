import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import ProfileTab from './ProfileTab';
import { ToastEnum } from '../../../enums';
import { User } from '../../../types';

const mocks = vi.hoisted(() => ({
  useGetUserInfoQuery: vi.fn(),
  updateUser: vi.fn(),
  updateUserUnwrap: vi.fn(),
  changePassword: vi.fn(),
  changePasswordUnwrap: vi.fn(),
  dispatch: vi.fn(),
  showToast: vi.fn(),
}));

vi.mock('../../../redux/services/user/userService', () => ({
  useGetUserInfoQuery: mocks.useGetUserInfoQuery,
  useUpdateUserInfoMutation: () => [mocks.updateUser],
  useChangePasswordMutation: () => [mocks.changePassword],
}));

vi.mock('../../../redux/store', () => ({
  useAppDispatch: () => mocks.dispatch,
}));

vi.mock('../../../utils/functions', () => ({
  useToast: () => ({ showToast: mocks.showToast }),
  useEscapeKey: vi.fn(),
}));

vi.mock('./ProfilePic', () => ({
  default: ({ picture }: { picture: string | undefined }) => (
    <img alt="profile" src={picture} />
  ),
}));

const mockUser: User = {
  _id: 'user-1',
  firstName: 'Ada',
  lastName: 'Lovelace',
  birthday: new Date('1995-04-10'),
  photoURL: 'https://example.com/profile.png',
  email: 'ada@example.com',
  password: 'secret',
  gender: 'Female',
  school: 'Babbage University',
  major: 'Computer Science',
  friends: [],
  receivedFriendRequests: [],
  sentFriendRequests: [],
  hobbies: ['Math'],
};

describe('ProfileTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useGetUserInfoQuery.mockReturnValue({ data: mockUser, isLoading: false });
    mocks.updateUser.mockReturnValue({ unwrap: mocks.updateUserUnwrap });
    mocks.updateUserUnwrap.mockResolvedValue({ ...mockUser, email: 'new@example.com' });
    mocks.changePassword.mockReturnValue({ unwrap: mocks.changePasswordUnwrap });
    mocks.changePasswordUnwrap.mockResolvedValue(true);
  });

  it('shows a loading spinner while user data is loading', () => {
    mocks.useGetUserInfoQuery.mockReturnValue({ data: undefined, isLoading: true });

    render(<ProfileTab />);

    expect(screen.getByLabelText('Profile loading spinner')).toBeInTheDocument();
  });

  it('shows a fallback when user data is unavailable', () => {
    mocks.useGetUserInfoQuery.mockReturnValue({ data: undefined, isLoading: false });

    render(<ProfileTab />);

    expect(screen.getByText('User information not available.')).toBeInTheDocument();
  });

  it('renders profile details when user data is available', async () => {
    render(<ProfileTab />);

    expect(await screen.findByText('Ada Lovelace')).toBeInTheDocument();
    expect(screen.getByDisplayValue('ada@example.com')).toBeInTheDocument();
    expect(screen.getByAltText('profile')).toHaveAttribute('src', mockUser.photoURL);
  });

  it('saves an updated email and shows a toast', async () => {
    render(<ProfileTab />);

    const emailInput = await screen.findByDisplayValue('ada@example.com');
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

    await waitFor(() => {
      expect(mocks.updateUser).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: mockUser.firstName,
          email: 'new@example.com',
        })
      );
    });
    expect(mocks.updateUser.mock.calls[0][0]).not.toHaveProperty('password');
    expect(mocks.dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'auth/updateUserInfo' }));
    expect(mocks.showToast).toHaveBeenCalledWith(ToastEnum.UPDATE_EMAIL);
  });

  it('opens the password modal and submits password changes', async () => {
    render(<ProfileTab />);

    fireEvent.click(await screen.findByRole('button', { name: 'Change Password' }));

    expect(screen.getByRole('heading', { name: 'Reset Password' })).toBeInTheDocument();

    fireEvent.change(document.getElementById('currentPassword') as HTMLInputElement, {
      target: { value: 'old-password' },
    });
    fireEvent.change(document.getElementById('newPassword') as HTMLInputElement, {
      target: { value: 'new-password' },
    });
    fireEvent.change(document.getElementById('newConfirmedPassword') as HTMLInputElement, {
      target: { value: 'new-password' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Reset Password' }));

    await waitFor(() => {
      expect(mocks.changePassword).toHaveBeenCalledWith({
        currentPassword: 'old-password',
        newPassword: 'new-password',
        confirmNewPassword: 'new-password',
      });
    });
    expect(mocks.showToast).toHaveBeenCalledWith(ToastEnum.UPDATE_PASSWORD);
  });

  it('shows password validation errors returned by the mutation', async () => {
    mocks.changePasswordUnwrap.mockRejectedValue({ data: 'Passwords must match' });

    render(<ProfileTab />);

    fireEvent.click(await screen.findByRole('button', { name: 'Change Password' }));
    fireEvent.click(screen.getByRole('button', { name: 'Reset Password' }));

    expect(await screen.findAllByText('Passwords must match')).toHaveLength(2);
  });
});
