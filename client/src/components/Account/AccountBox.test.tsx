import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { Provider } from 'react-redux';
import AccountBox from './AccountBox';
import store from '../../redux/store';
import { AccountTabEnum } from '../../enums';

describe('AccountBox Component', () => {
  it('renders Profile, Personal, and Hobbies tabs', () => {
    render(
      <Provider store={store}>
        <AccountBox />
      </Provider>
    );
    
    expect(screen.getByText(AccountTabEnum.PROFILE)).toBeInTheDocument();
    expect(screen.getByText(AccountTabEnum.PERSONAL)).toBeInTheDocument();
    expect(screen.getByText(AccountTabEnum.HOBBIES)).toBeInTheDocument();
  });
});
