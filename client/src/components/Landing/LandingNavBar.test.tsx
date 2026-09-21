import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import LandingNavBar from './LandingNavBar';

vi.mock('../Toggle', () => ({
  default: () => <button type="button">Theme</button>,
}));

vi.mock('../../utils/functions', () => ({
  isDarkModeOn: () => false,
}));

describe('LandingNavBar', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const renderNavBar = () =>
    render(
      <MemoryRouter>
        <LandingNavBar />
      </MemoryRouter>
    );

  it('links navigation controls to the correct destinations', () => {
    renderNavBar();

    expect(screen.getByRole('link', { name: 'ScheduleFinder' })).toHaveAttribute('href', '#top');
    expect(screen.getByRole('link', { name: 'Features' })).toHaveAttribute('href', '#features');
    expect(screen.getByRole('link', { name: 'Testimonials' })).toHaveAttribute(
      'href',
      '#testimonials'
    );

    const repository = screen.getByRole('link', { name: 'Repository' });
    expect(repository).toHaveAttribute('href', 'https://github.com/KyoshiNoda/ScheduleFinder');
    expect(repository).toHaveAttribute('target', '_blank');
    expect(repository).toHaveAttribute('rel', 'noreferrer');

    screen.getAllByRole('link', { name: 'Login' }).forEach((loginLink) => {
      expect(loginLink).toHaveAttribute('href', '/login');
    });
    expect(screen.getByRole('link', { name: 'Get Started' })).toHaveAttribute('href', '/signup');
  });

  it('closes the mobile menu after an in-page link is selected', () => {
    renderNavBar();

    fireEvent.click(screen.getByRole('button', { name: 'Toggle navigation menu' }));
    const mobileMenu = document.getElementById('mobile-navigation');

    expect(mobileMenu).toBeInTheDocument();
    fireEvent.click(within(mobileMenu as HTMLElement).getByRole('link', { name: 'Features' }));
    expect(document.getElementById('mobile-navigation')).not.toBeInTheDocument();
  });
});
