import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import HobbiesTab from './HobbiesTab';
import { ToastEnum } from '../../../enums';

const mocks = vi.hoisted(() => ({
  useGetUserHobbiesQuery: vi.fn(),
  addHobby: vi.fn(),
  showToast: vi.fn(),
}));

vi.mock('../../../redux/services/hobbies/hobbyService', () => ({
  useGetUserHobbiesQuery: mocks.useGetUserHobbiesQuery,
  useAddUserHobbyMutation: () => [mocks.addHobby],
  useRemoveUserHobbyMutation: () => [vi.fn()],
}));

vi.mock('../../../redux/store', () => ({
  useAppSelector: () => ({ state: false, message: null }),
}));

vi.mock('../../../utils/functions', () => ({
  useToast: () => ({ showToast: mocks.showToast }),
  useEscapeKey: vi.fn(),
}));

describe('HobbiesTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useGetUserHobbiesQuery.mockReturnValue({
      data: { hobbies: ['Reading', 'Climbing'] },
      isLoading: false,
    });
    mocks.addHobby.mockResolvedValue({});
  });

  it('shows a loading spinner while hobbies are loading', () => {
    mocks.useGetUserHobbiesQuery.mockReturnValue({ data: undefined, isLoading: true });

    render(<HobbiesTab />);

    expect(screen.getByLabelText('Profile loading spinner')).toBeInTheDocument();
  });

  it('renders an empty state when the user has no hobbies', async () => {
    mocks.useGetUserHobbiesQuery.mockReturnValue({ data: { hobbies: [] }, isLoading: false });

    render(<HobbiesTab />);

    expect(await screen.findByText('No Hobbies Found!')).toBeInTheDocument();
  });

  it('renders existing hobbies', async () => {
    render(<HobbiesTab />);

    expect(await screen.findByRole('button', { name: 'Reading' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Climbing' })).toBeInTheDocument();
  });

  it('adds a hobby, clears the input, and shows a toast', async () => {
    render(<HobbiesTab />);

    const input = screen.getByPlaceholderText('Enter hobby name');
    fireEvent.change(input, { target: { value: 'Cooking' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    await waitFor(() => {
      expect(mocks.addHobby).toHaveBeenCalledWith({ name: 'Cooking' });
    });
    expect(input).toHaveValue('');
    expect(mocks.showToast).toHaveBeenCalledWith(ToastEnum.ADDED_HOBBY);
  });

  it('opens the removal modal when an existing hobby is clicked', async () => {
    render(<HobbiesTab />);

    fireEvent.click(await screen.findByRole('button', { name: 'Reading' }));

    expect(screen.getByText('Remove Reading from your hobbies?')).toBeInTheDocument();
  });
});
