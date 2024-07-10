import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RxHamburgerMenu } from 'react-icons/rx';
import Toggle from '../Toggle';
import { isDarkModeOn } from '../../utils/functions';
import { Themes } from '../../enums';

const LandingNavBar = () => {
  const [theme, setTheme] = useState<string>(isDarkModeOn() ? Themes.DARK : Themes.LIGHT);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

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
    <nav className="flex items-center justify-between p-4 dark:bg-slate-900">
      <span className="text-lg font-semibold dark:text-white lg:text-3xl">ScheduleFinder</span>
      <div className="hidden w-1/3 justify-evenly gap-4 text-xl font-bold text-gray-500 dark:text-gray-400 md:flex">
        <a>Features</a>
        <a>Testimonials</a>
        <a>Repository</a>
      </div>
      <div className="hidden items-center gap-6 md:flex">
        <Link to="/login" className="font-bold text-gray-500 dark:text-gray-400 md:text-lg">
          Login
        </Link>
        <Link
          to="/signup"
          className="rounded-xl bg-blue-600 px-3 py-2 text-lg font-bold text-white dark:bg-blue-800"
        >
          Get Started
        </Link>
        <Toggle getTheme={setTheme} />
      </div>
      <div className="flex items-center gap-4 md:hidden">
        <Link
          to="/signup"
          className="text-md rounded-lg px-4 py-1 font-bold text-gray-500 dark:bg-blue-800"
        >
         Login
        </Link>
        <Toggle getTheme={setTheme} />
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none">
          <RxHamburgerMenu size={32} color={theme === Themes.DARK ? 'white' : ''} />
        </button>
      </div>
      {isMenuOpen && (
        <div className="absolute top-16 left-0 flex w-full flex-col items-center gap-4 bg-gray-100 p-4 shadow-xl dark:bg-slate-900 md:hidden">
          <a className="text-xl font-bold text-gray-500 dark:text-gray-400">Features</a>
          <a className="text-xl font-bold text-gray-500 dark:text-gray-400">Testimonials</a>
          <a className="text-xl font-bold text-gray-500 dark:text-gray-400">Repository</a>
        </div>
      )}
    </nav>
  );
};

export default LandingNavBar;
