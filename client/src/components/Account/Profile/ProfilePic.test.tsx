import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import ProfilePic from './ProfilePic';
import { ToastEnum } from '../../../enums';

const mocks = vi.hoisted(() => ({
  changeProfilePicture: vi.fn(),
  changeProfilePictureUnwrap: vi.fn(),
  dispatch: vi.fn(),
  showToast: vi.fn(),
}));

vi.mock('../../../redux/services/user/userService', () => ({
  useChangeProfilePictureMutation: () => [mocks.changeProfilePicture],
}));

vi.mock('../../../redux/store', () => ({
  useAppDispatch: () => mocks.dispatch,
  useAppSelector: () => ({
    _id: 'user-1',
    firstName: 'Ada',
    photoURL: 'https://example.com/old.png',
  }),
}));

vi.mock('../../../utils/functions', () => ({
  useToast: () => ({ showToast: mocks.showToast }),
}));

describe('ProfilePic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.changeProfilePicture.mockReturnValue({ unwrap: mocks.changeProfilePictureUnwrap });
    mocks.changeProfilePictureUnwrap.mockResolvedValue({
      imageUrl: 'https://example.com/new.png',
    });
  });

  it('renders the current profile picture', () => {
    const { container } = render(<ProfilePic picture="https://example.com/old.png" />);

    expect(container.querySelector('img')).toHaveAttribute('src', 'https://example.com/old.png');
  });

  it('shows the edit overlay on hover', () => {
    const { container } = render(<ProfilePic picture="https://example.com/old.png" />);

    fireEvent.mouseEnter(container.firstElementChild as Element);

    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('uploads a selected file and updates the rendered image', async () => {
    const { container } = render(<ProfilePic picture="https://example.com/old.png" />);

    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(mocks.changeProfilePicture).toHaveBeenCalledWith({ file });
    });
    expect(mocks.dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'auth/updateUserInfo' }));
    expect(mocks.showToast).toHaveBeenCalledWith(ToastEnum.UPDATE_PROFILE_PICTURE);
    expect(container.querySelector('img')).toHaveAttribute('src', 'https://example.com/new.png');
  });
});
