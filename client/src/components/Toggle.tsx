import { FiSun } from 'react-icons/fi';
import { FaRegMoon } from 'react-icons/fa';
import { useState, useEffect } from 'react';

type Props = {
  getTheme?: (theme: string) => void;
};

enum Themes {
  DARK = 'black',
  LIGHT = 'white',
}

const Toggle = (props: Props) => {

  const isDarkModeOn = () => {
    const darkModeStatus = localStorage.getItem('isDarkModeOn'); 
    if (darkModeStatus) {
      return JSON.parse(darkModeStatus);
    }
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    return mediaQuery.matches;
  };

  const [theme, setTheme] = useState<string>('');
  const [userPrefersDark, setUserPrefersDark] = useState<boolean>(isDarkModeOn());
  const [toggle, setToggle] = useState<boolean>(isDarkModeOn());

  userPrefersDark ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark');

  const handleThemeSwitch = () => {
    setTheme(theme === Themes.DARK ? Themes.LIGHT : Themes.DARK);
    setUserPrefersDark(!userPrefersDark);
    localStorage.setItem('isDarkModeOn', JSON.stringify(!userPrefersDark));
    props.getTheme?.(theme);
  };

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToggle(event.target.checked);
    handleThemeSwitch();
  };

  return (
    <div className="flex gap-1">
      <FiSun
        size="20"
        color={userPrefersDark ? Themes.LIGHT : Themes.DARK}
      />

      <div>
        <label className="relative mb-5 inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={toggle}
            onChange={handleToggleChange}
            className="peer sr-only"
          />
          <div className="peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
        </label>
      </div>
      <FaRegMoon
        size="20"
        color={userPrefersDark ? Themes.LIGHT : Themes.DARK}
      />
    </div>
  );
};

export default Toggle;
