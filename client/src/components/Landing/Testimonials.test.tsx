import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Testimonials from './Testimonials';

vi.mock('flowbite-react', () => ({
  Avatar: ({ placeholderInitials }: { placeholderInitials: string }) => (
    <span>{placeholderInitials}</span>
  ),
}));

describe('Testimonials', () => {
  it('cycles through the requested student testimonials', () => {
    render(<Testimonials />);

    expect(screen.getByText('Carlos Duque')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Next testimonial' }));
    expect(screen.getByText('Joyce Jorda')).toBeInTheDocument();
    expect(
      screen.getByText(/easy way to see my classes without having to pull out my laptop/i)
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Next testimonial' }));
    expect(screen.getByText('Kyoshi Noda')).toBeInTheDocument();
  });
});
