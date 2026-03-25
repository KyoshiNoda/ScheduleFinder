export const getApiUrl = (): string => {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (apiUrl && apiUrl.trim().length > 0) {
    return apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
  }

  return 'http://localhost:3001/';
};
