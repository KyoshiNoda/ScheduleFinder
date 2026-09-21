import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Features from './Features';

let intersectionCallback: IntersectionObserverCallback;
const observe = vi.fn();
const unobserve = vi.fn();
const disconnect = vi.fn();

class IntersectionObserverMock {
  constructor(callback: IntersectionObserverCallback) {
    intersectionCallback = callback;
  }

  observe = observe;
  unobserve = unobserve;
  disconnect = disconnect;
}

describe('Features', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('alternates the reveal direction for each feature', () => {
    render(<Features />);

    expect(screen.getByTestId('feature-0')).toHaveClass('feature-reveal-from-left');
    expect(screen.getByTestId('feature-1')).toHaveClass('feature-reveal-from-right');
    expect(screen.getByTestId('feature-2')).toHaveClass('feature-reveal-from-left');
  });

  it('reveals and unobserves a feature the first time it enters the viewport', () => {
    render(<Features />);
    const feature = screen.getByTestId('feature-1');

    expect(observe).toHaveBeenCalledTimes(3);
    expect(feature).not.toHaveClass('feature-reveal-visible');

    act(() => {
      intersectionCallback(
        [{ isIntersecting: true, target: feature } as unknown as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    expect(feature).toHaveClass('feature-reveal-visible');
    expect(unobserve).toHaveBeenCalledWith(feature);
  });
});
