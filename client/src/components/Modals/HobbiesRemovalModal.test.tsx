import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import HobbiesRemovalModal from './HobbiesRemovalModal';
import { ToastEnum } from '../../enums';

const mocks = vi.hoisted(() => ({
  removeHobby: vi.fn(),
  showToast: vi.fn(),
}));

vi.mock('../../redux/services/hobbies/hobbyService', () => ({
  useRemoveUserHobbyMutation: () => [mocks.removeHobby],
}));

vi.mock('../../utils/functions', () => ({
  useToast: () => ({ showToast: mocks.showToast }),
  useEscapeKey: vi.fn(),
}));

describe('HobbiesRemovalModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.removeHobby.mockResolvedValue({});
  });

  it('renders the selected hobby removal message', () => {
    render(<HobbiesRemovalModal openModal={true} setOpenModal={vi.fn()} selectedHobby="Reading" />);

    expect(screen.getByText('Remove Reading from your hobbies?')).toBeInTheDocument();
  });

  it('closes the modal when cancel is clicked', () => {
    const setOpenModal = vi.fn();
    render(<HobbiesRemovalModal openModal={true} setOpenModal={setOpenModal} selectedHobby="Reading" />);

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(setOpenModal).toHaveBeenCalledWith(false);
  });

  it('removes the selected hobby and shows a toast', async () => {
    const setOpenModal = vi.fn();
    render(<HobbiesRemovalModal openModal={true} setOpenModal={setOpenModal} selectedHobby="Reading" />);

    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));

    await waitFor(() => {
      expect(mocks.removeHobby).toHaveBeenCalledWith({ name: 'Reading' });
    });
    expect(setOpenModal).toHaveBeenCalledWith(false);
    expect(mocks.showToast).toHaveBeenCalledWith(ToastEnum.REMOVE_HOBBY);
  });
});
