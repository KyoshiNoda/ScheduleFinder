import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Tab from './Tab';
import { AccountTabEnum } from '../../enums';

describe('Tab Component', () => {
  it('renders all tabs and calls getTab when a tab is clicked', () => {
    const mockGetTab = vi.fn();

    render(<Tab activeTab={AccountTabEnum.PROFILE} getTab={mockGetTab} />);

    // Check if all tabs are rendered
    expect(screen.getByText(AccountTabEnum.PROFILE)).toBeInTheDocument();
    expect(screen.getByText(AccountTabEnum.PERSONAL)).toBeInTheDocument();
    expect(screen.getByText(AccountTabEnum.HOBBIES)).toBeInTheDocument();

    // Simulate clicking the Personal tab
    fireEvent.click(screen.getByText(AccountTabEnum.PERSONAL));
    expect(mockGetTab).toHaveBeenCalledWith(AccountTabEnum.PERSONAL);

    // Simulate clicking the Hobbies tab
    fireEvent.click(screen.getByText(AccountTabEnum.HOBBIES));
    expect(mockGetTab).toHaveBeenCalledWith(AccountTabEnum.HOBBIES);

    // Check if the active tab class is correctly applied
    expect(screen.getByText(AccountTabEnum.PROFILE)).toHaveClass('active-tab');
  });
});
