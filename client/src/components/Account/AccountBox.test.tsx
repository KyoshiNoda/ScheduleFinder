import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { Provider } from 'react-redux';
import AccountBox from './AccountBox';
import store from '../../redux/store';
import { AccountTabEnum } from '../../enums';

describe('AccountBox Component', () => {
  it('renders tab & switches between them correctly', () => {
    render(
      <Provider store={store}>
        <AccountBox />
      </Provider>
    );

    // Check initial state: Profile tab should be active and rendered
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText(AccountTabEnum.PROFILE)).toHaveClass('active-tab');

    fireEvent.click(screen.getByText(AccountTabEnum.PERSONAL));
    expect(screen.getByText(AccountTabEnum.PERSONAL)).toHaveClass('active-tab');
    expect(screen.getByText('Personal')).toBeInTheDocument();

    fireEvent.click(screen.getByText(AccountTabEnum.HOBBIES));
    expect(screen.getByText(AccountTabEnum.HOBBIES)).toHaveClass('active-tab');
    expect(screen.getByText('Hobbies')).toBeInTheDocument();
  });
});
