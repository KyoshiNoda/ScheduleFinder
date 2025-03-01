import { useState, useEffect } from 'react';
import { FiSun } from 'react-icons/fi';
import { FaRegMoon } from 'react-icons/fa';
import { isDarkModeOn } from '../utils/functions';
import { Themes } from '../enums';

type Props = {
  getTheme?: (theme: string) => void;
  overrideBackground?: string;
};

const Toggle = (props: Props) => {
  const [currentTheme, setCurrentTheme] = useState<string>(
    localStorage.getItem('theme') || Themes.SYSTEM
  );
  const [userPrefersDark, setUserPrefersDark] = useState<boolean>(isDarkModeOn());
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (currentTheme === Themes.SYSTEM) {
        setUserPrefersDark(e.matches);
      }
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [currentTheme]);

  useEffect(() => {
    if (currentTheme === Themes.SYSTEM) {
      setUserPrefersDark(isDarkModeOn());
    }
  }, [currentTheme]);

  useEffect(() => {
    if (currentTheme === Themes.DARK || (currentTheme === Themes.SYSTEM && isDarkModeOn())) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentTheme, userPrefersDark]);

  const handleThemeSwitch = (theme: string) => {
    setCurrentTheme(theme);
    if (theme === Themes.SYSTEM) {
      setUserPrefersDark(isDarkModeOn());
    } else {
      setUserPrefersDark(theme === Themes.DARK);
    }
    localStorage.setItem('theme', theme);
    props.getTheme?.(theme);
  };
  
  const handleMenuItemClick = (theme: string) => {
    handleThemeSwitch(theme);
    setDropdownOpen(false);
  };

  const iconColor = () => {
    if (currentTheme === Themes.SYSTEM) {
      return isDarkModeOn() ? 'white' : 'black';
    }
    return userPrefersDark ? 'white' : 'black';
  };

  return (
    <div className={`${props.overrideBackground} flex justify-end`}>
      <button
        onClick={() => setDropdownOpen((dropdownOpen) => !dropdownOpen)}
        className="flex items-center gap-1 rounded-lg border p-3 border-black dark:border-white"
      >
        {userPrefersDark ? (
          <FaRegMoon size="20" color={iconColor()} />
        ) : (
          <FiSun size="20" color={iconColor()} />
        )}
      </button>
      {dropdownOpen && (
        <div className="absolute top-16 z-20 w-48 rounded-md bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <button
              onClick={() => handleMenuItemClick(Themes.LIGHT)}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-100 hover:dark:bg-gray-900"
            >
              Light
            </button>
            <button
              onClick={() => handleMenuItemClick(Themes.DARK)}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-100 hover:dark:bg-gray-900"
            >
              Dark
            </button>
            <button
              onClick={() => handleMenuItemClick(Themes.SYSTEM)}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700  dark:text-gray-100 hover:bg-gray-100 hover:dark:bg-gray-900"
            >
              System
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Toggle;
