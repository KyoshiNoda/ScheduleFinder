export const isDarkModeOn = () => {
  const darkModeStatus = localStorage.getItem('isDarkModeOn');
  if (darkModeStatus) {
    return JSON.parse(darkModeStatus);
  }
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  return mediaQuery.matches;
};
