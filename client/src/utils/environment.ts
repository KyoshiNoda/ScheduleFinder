export const getApiUrl = (): string => {
  // TODO: CHANGE PROPER ENVIRONMENT BELOW  
  let environment = 'local';

  let apiUrl = '';

  if (environment === 'local') {
    apiUrl = 'http://localhost:3001/';
  } else if (environment === 'dev') {
    apiUrl = 'https://schedulefinder-development.up.railway.app/';
  } else if (environment === 'prod') {
    apiUrl = 'https://schedulefinder-production.up.railway.app/';
  }

  return apiUrl;
};
