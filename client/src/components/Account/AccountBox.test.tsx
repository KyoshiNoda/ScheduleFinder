import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import AccountBox from './AccountBox';
import { AccountTabEnum } from '../../enums';

vi.mock('./Profile/ProfileTab', () => ({
  default: () => <div>Profile panel</div>,
}));

vi.mock('./Personal/PersonalTab', () => ({
  default: () => <div>Personal panel</div>,
}));

vi.mock('./Hobbies/HobbiesTab', () => ({
  default: () => <div>Hobbies panel</div>,
}));

describe('AccountBox Component', () => {
  it('renders Profile, Personal, and Hobbies tabs', () => {
    render(<AccountBox />);

    expect(screen.getByText(AccountTabEnum.PROFILE)).toBeInTheDocument();
    expect(screen.getByText(AccountTabEnum.PERSONAL)).toBeInTheDocument();
    expect(screen.getByText(AccountTabEnum.HOBBIES)).toBeInTheDocument();
  });

  it('shows the profile panel by default', () => {
    render(<AccountBox />);

    expect(screen.getByText('Profile panel')).toBeInTheDocument();
    expect(screen.queryByText('Personal panel')).not.toBeInTheDocument();
    expect(screen.queryByText('Hobbies panel')).not.toBeInTheDocument();
  });

  it('switches account panels when tabs are clicked', () => {
    render(<AccountBox />);

    fireEvent.click(screen.getByText(AccountTabEnum.PERSONAL));

    expect(screen.getByText('Personal panel')).toBeInTheDocument();
    expect(screen.queryByText('Profile panel')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText(AccountTabEnum.HOBBIES));

    expect(screen.getByText('Hobbies panel')).toBeInTheDocument();
    expect(screen.queryByText('Personal panel')).not.toBeInTheDocument();
  });
});
