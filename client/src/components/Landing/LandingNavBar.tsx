import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RxHamburgerMenu } from 'react-icons/rx';
import Toggle from '../Toggle';
import { isDarkModeOn } from '../../utils/functions';
import { Themes } from '../../enums';

const repositoryUrl = 'https://github.com/KyoshiNoda/ScheduleFinder';

const LandingNavBar = () => {
  const [theme, setTheme] = useState<string>(isDarkModeOn() ? Themes.DARK : Themes.LIGHT);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? Themes.DARK : Themes.LIGHT);
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  const closeMenu = () => setIsMenuOpen(false);
  const navLinkClasses =
    'rounded-lg px-3 py-2 font-bold text-gray-500 transition-colors hover:text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:text-gray-400 dark:hover:text-blue-400';

  return (
    <nav
      aria-label="Landing page navigation"
      className="sticky top-0 z-50 flex items-center justify-between bg-gray-100 bg-opacity-95 px-4 py-5 shadow-sm dark:bg-slate-900 md:px-8"
    >
      <a
        href="#top"
        className="rounded-lg text-xl font-semibold dark:text-white md:text-2xl lg:text-3xl"
      >
        ScheduleFinder
      </a>
      <div className="hidden items-center justify-evenly gap-2 text-lg md:flex lg:gap-4 lg:text-xl">
        <a href="#features" className={navLinkClasses}>
          Features
        </a>
        <a href="#testimonials" className={navLinkClasses}>
          Testimonials
        </a>
        <a href={repositoryUrl} target="_blank" rel="noreferrer" className={navLinkClasses}>
          Repository
        </a>
      </div>
      <div className="hidden items-center gap-4 md:flex lg:gap-6">
        <Link to="/login" className={navLinkClasses}>
          Login
        </Link>
        <Link
          to="/signup"
          className="rounded-xl bg-blue-600 px-4 py-3 text-lg font-bold text-white transition-colors hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-700"
        >
          Get Started
        </Link>
        <Toggle getTheme={setTheme} />
      </div>
      <div className="flex items-center gap-3 md:hidden">
        <Link
          to="/login"
          className="rounded-lg px-3 py-2 font-bold text-gray-500 dark:text-gray-400"
        >
          Login
        </Link>
        <Toggle getTheme={setTheme} />
        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="rounded-lg p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <RxHamburgerMenu size={32} color={theme === Themes.DARK ? 'white' : undefined} />
        </button>
      </div>
      {isMenuOpen && (
        <div
          id="mobile-navigation"
          className="absolute left-0 top-full flex w-full flex-col items-center gap-2 bg-gray-100 p-4 shadow-xl dark:bg-slate-900 md:hidden"
        >
          <a href="#features" onClick={closeMenu} className={`text-xl ${navLinkClasses}`}>
            Features
          </a>
          <a href="#testimonials" onClick={closeMenu} className={`text-xl ${navLinkClasses}`}>
            Testimonials
          </a>
          <a
            href={repositoryUrl}
            target="_blank"
            rel="noreferrer"
            onClick={closeMenu}
            className={`text-xl ${navLinkClasses}`}
          >
            Repository
          </a>
        </div>
      )}
    </nav>
  );
};

export default LandingNavBar;
