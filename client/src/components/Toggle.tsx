import { FiSun } from 'react-icons/fi';
import { FaRegMoon } from 'react-icons/fa';
import { useState } from 'react';
import { isDarkModeOn } from '../utils/functions';
import { Themes } from '../enums';

type Props = {
  getTheme?: (theme: string) => void;
};

const Toggle = (props: Props) => {
  const [userPrefersDark, setUserPrefersDark] = useState<boolean>(isDarkModeOn());
  const [toggle, setToggle] = useState<boolean>(isDarkModeOn());

  userPrefersDark ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark');

  const handleThemeSwitch = () => {
    setUserPrefersDark(!userPrefersDark);
    localStorage.setItem('isDarkModeOn', JSON.stringify(!userPrefersDark));
    props.getTheme?.(userPrefersDark ? Themes.DARK : Themes.LIGHT);
  };

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToggle(event.target.checked);
    handleThemeSwitch();
  };

  return (
    <div className="flex justify-end gap-1 bg-slate-400 py-5 px-8 dark:bg-slate-900">
      <FiSun size="20" color={userPrefersDark ? Themes.LIGHT : Themes.DARK} />
      <div>
        <label className="relative mb-5 inline-flex cursor-pointer items-center">
          <input type="checkbox" checked={toggle} onChange={handleToggleChange} className="peer sr-only" />
          <div className="peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
        </label>
      </div>
      <FaRegMoon size="20" color={userPrefersDark ? Themes.LIGHT : Themes.DARK} />
    </div>
  );
};

export default Toggle;
