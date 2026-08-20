import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import PersonalTab from './PersonalTab';
import { ToastEnum } from '../../../enums';
import { User } from '../../../types';

const mocks = vi.hoisted(() => ({
  useGetUserInfoQuery: vi.fn(),
  updateUser: vi.fn(),
  updateUserUnwrap: vi.fn(),
  dispatch: vi.fn(),
  showToast: vi.fn(),
}));

vi.mock('../../../redux/services/user/userService', () => ({
  useGetUserInfoQuery: mocks.useGetUserInfoQuery,
  useUpdateUserInfoMutation: () => [mocks.updateUser],
}));

vi.mock('../../../redux/store', () => ({
  useAppDispatch: () => mocks.dispatch,
}));

vi.mock('../../../utils/functions', () => ({
  useToast: () => ({ showToast: mocks.showToast }),
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
  hobbies: [],
};

describe('PersonalTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useGetUserInfoQuery.mockReturnValue({ data: mockUser, isLoading: false });
    mocks.updateUser.mockReturnValue({ unwrap: mocks.updateUserUnwrap });
    mocks.updateUserUnwrap.mockResolvedValue({ ...mockUser, firstName: 'Grace' });
  });

  it('shows a loading spinner while user data is loading', () => {
    mocks.useGetUserInfoQuery.mockReturnValue({ data: undefined, isLoading: true });

    render(<PersonalTab />);

    expect(screen.getByLabelText('Profile loading spinner')).toBeInTheDocument();
  });

  it('shows a fallback when user data is unavailable', () => {
    mocks.useGetUserInfoQuery.mockReturnValue({ data: undefined, isLoading: false });

    render(<PersonalTab />);

    expect(screen.getByText('User information not available.')).toBeInTheDocument();
  });

  it('renders saved personal information', async () => {
    render(<PersonalTab />);

    expect(await screen.findByDisplayValue('Ada')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Lovelace')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Babbage University')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Computer Science')).toBeInTheDocument();
    expect(document.getElementById('birthdate')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Female/i })).toBeInTheDocument();
  });

  it('saves changed personal fields and shows a toast', async () => {
    render(<PersonalTab />);

    fireEvent.change(await screen.findByDisplayValue('Ada'), {
      target: { value: 'Grace' },
    });
    fireEvent.change(screen.getByDisplayValue('Computer Science'), {
      target: { value: 'Mathematics' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

    await waitFor(() => {
      expect(mocks.updateUser).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'Grace',
          major: 'Mathematics',
          gender: 'Female',
        })
      );
    });
    expect(mocks.dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'auth/updateUserInfo' }));
    expect(mocks.showToast).toHaveBeenCalledWith(ToastEnum.SAVED_INFO);
  });

  it('saves a newly selected gender', async () => {
    render(<PersonalTab />);

    fireEvent.click(await screen.findByRole('button', { name: /Female/i }));
    fireEvent.click(screen.getByText('Other'));
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

    await waitFor(() => {
      expect(mocks.updateUser).toHaveBeenCalledWith(expect.objectContaining({ gender: 'Other' }));
    });
  });
});
