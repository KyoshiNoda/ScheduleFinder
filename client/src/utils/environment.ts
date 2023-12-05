export const getApiUrl = (): string => {
  // When merging, change this to the current environment
  let environment = 'local';

  let apiUrl = '';

  if (environment === 'dev') {
    apiUrl = 'http://localhost:3001/';
  } else if (environment === 'dev') {
    apiUrl = 'https://schedulefinder-development.up.railway.app/';
  } else if (environment === 'prod') {
    apiUrl = 'https://schedulefinder-production.up.railway.app/';
  }

  return apiUrl;
};
