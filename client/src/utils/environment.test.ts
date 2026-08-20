import { afterEach, describe, expect, it, vi } from 'vitest';
import { getApiUrl } from './environment';

describe('getApiUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('uses VITE_API_URL when it is set', () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.com');

    expect(getApiUrl()).toBe('https://api.example.com/');
  });

  it('preserves a trailing slash on VITE_API_URL', () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.com/');

    expect(getApiUrl()).toBe('https://api.example.com/');
  });

  it('uses localhost only in development', () => {
    vi.stubEnv('VITE_API_URL', '');
    vi.stubEnv('DEV', true);

    expect(getApiUrl()).toBe('http://localhost:3001/');
  });

  it('throws in production when VITE_API_URL is missing', () => {
    vi.stubEnv('VITE_API_URL', '');
    vi.stubEnv('DEV', false);
    vi.stubEnv('PROD', true);

    expect(() => getApiUrl()).toThrow('Missing VITE_API_URL');
  });
});
