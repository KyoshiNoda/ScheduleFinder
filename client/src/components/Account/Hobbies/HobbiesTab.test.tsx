import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { describe, expect, it, vi } from 'vitest';
import HobbiesTab from './HobbiesTab';
import { ToastEnum } from '../../../enums';
import {
  useGetUserHobbiesQuery,
  useAddUserHobbyMutation,
} from '../../../redux/services/hobbies/hobbyService';
import store from '../../../redux/store';

vi.mock('../../../redux/services/hobbies/hobbyService', async () => {
  const originalModule = await vi.importActual<typeof import('../../../redux/services/hobbies/hobbyService')>(
    '../../../redux/services/hobbies/hobbyService'
  );
  return {
    ...originalModule,
    useGetUserHobbiesQuery: vi.fn(),
    useAddUserHobbyMutation: vi.fn(),
  };
});

vi.mock('../../../utils/functions', () => ({
  useToast: () => ({
    showToast: vi.fn(),
  }),
}));

describe('HobbiesTab Component', () => {
  it('should render loading spinner when loading', () => {
    (useGetUserHobbiesQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      data: null,
      isLoading: true,
    });

    render(
      <Provider store={store}>
        <HobbiesTab />
      </Provider>
    );

    expect(screen.getByLabelText('Profile loading spinner')).toBeInTheDocument();
  });

  it('should display hobbies when data is available', async () => {
    const hobbies = ['Reading', 'Gaming'];
    (useGetUserHobbiesQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { hobbies },
      isLoading: false,
    });

    render(
      <Provider store={store}>
        <HobbiesTab />
      </Provider>
    );

    hobbies.forEach((hobby) => {
      expect(screen.getByText(hobby)).toBeInTheDocument();
    });
  });

  it('should handle adding a new hobby', async () => {
    const addHobbyMock = vi.fn().mockResolvedValue({});
    (useAddUserHobbyMutation as ReturnType<typeof vi.fn>).mockReturnValue([addHobbyMock]);

    render(
      <Provider store={store}>
        <HobbiesTab />
      </Provider>
    );

    const input = screen.getByPlaceholderText('Enter hobby name');
    fireEvent.change(input, { target: { value: 'Cooking' } });

    const button = screen.getByText('Add');
    fireEvent.click(button);

    await waitFor(() => {
      expect(addHobbyMock).toHaveBeenCalledWith({ name: 'Cooking' });
      expect(input).toHaveValue('');
    });
  });

  it('should show toast when a new hobby is added', async () => {
    const addHobbyMock = vi.fn().mockResolvedValue({});
    (useAddUserHobbyMutation as ReturnType<typeof vi.fn>).mockReturnValue([addHobbyMock]);

    render(
      <Provider store={store}>
        <HobbiesTab />
      </Provider>
    );

    const input = screen.getByPlaceholderText('Enter hobby name');
    fireEvent.change(input, { target: { value: 'Cooking' } });

    const button = screen.getByText('Add');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(ToastEnum.ADDED_HOBBY)).toBeInTheDocument();
    });
  });
});
