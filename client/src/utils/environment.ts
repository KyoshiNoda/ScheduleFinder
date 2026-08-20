export const getApiUrl = (): string => {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (apiUrl && apiUrl.trim().length > 0) {
    return apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
  }

  if (import.meta.env.DEV) {
    return 'http://localhost:3001/';
  }

  throw new Error(
    'Missing VITE_API_URL. Production builds must set VITE_API_URL to the deployed API origin.'
  );
};
