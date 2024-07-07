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
    <div className="flex justify-between items-center p-4 dark:bg-slate-900">
      <Link to="/auth/schedule" className="text-3xl font-semibold dark:text-white">
        ScheduleFinder
      </Link>
      <div className='w-1/3 flex justify-evenly text-lg text-gray-500 dark:text-gray-400 font-bold'>
        <a>Features</a>
        <a>Testimonials</a>
        <a>Repository </a>
      </div>
      <Toggle getTheme={setTheme} />
    </div>
  );
};
export default LandingNavBar;
