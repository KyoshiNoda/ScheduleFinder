import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Toggle from '../Toggle';
import { isDarkModeOn } from '../../utils/functions';
import { Themes } from '../../enums';
const LandingNavBar = () => {
  const [theme, setTheme] = useState<string>(isDarkModeOn() ? Themes.DARK : Themes.LIGHT);

  useEffect(() => {
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setTheme(Themes.DARK);
      } else {
        setTheme(Themes.LIGHT);
      }
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  return (
    <div className="flex items-center justify-between p-4 dark:bg-slate-900">
      <span className="text-3xl font-semibold dark:text-white">ScheduleFinder</span>
      <div className="flex w-1/3 justify-evenly text-xl font-bold text-gray-500 dark:text-gray-400">
        <a>Features</a>
        <a>Testimonials</a>
        <a>Repository </a>
      </div>
      <div className="flex items-center gap-6">
        <Link to="/login" className="text-lg font-bold text-gray-500 dark:text-gray-400">
          Login
        </Link>
        <Link to="/login" className="rounded-xl bg-blue-600 dark:bg-blue-800 px-3 py-2 text-lg font-bold text-white">
          Get Started
        </Link>
        <Toggle getTheme={setTheme} />
      </div>
    </div>
  );
};
export default LandingNavBar;
