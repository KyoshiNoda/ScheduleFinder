import { FiSun } from 'react-icons/fi';
import { FaRegMoon } from 'react-icons/fa';
import { useState, useEffect } from 'react';
type Props = {
  getTheme?: (theme: string) => void;
};

function Toggle(props: Props) {
  const [theme, setTheme] = useState<string>('');
  const [toggle,setToggle] =useState<boolean | undefined>(undefined);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const userPrefersDark = mediaQuery.matches;

    if (userPrefersDark) {  
      setTheme('black');
      setToggle(true);
    } else {
      setTheme('white');
      setToggle(false);
    }
  }, []);

  useEffect(()  => {
    if (theme === 'black') {
      document.documentElement.classList.add('dark');
      setToggle(true);
    } else {
      document.documentElement.classList.remove('dark');
      setToggle(false);
    }
  }, [theme]);

  const handleThemeSwitch = () => {
    setTheme(theme === 'black' ? 'white' : 'black');
    props.getTheme?.(theme);
  };

  return (
    <div className="flex">
      <FiSun size="25" color={theme === 'black' ? 'white' : 'black'} />

      <div>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked = {toggle}
            value=""
            className="peer sr-only"
            onClick={handleThemeSwitch}
          />
          <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
        </label>
      </div>
      <FaRegMoon size="25" color={theme === 'black' ? 'white' : 'black'} />
    </div>
  );
}

export default Toggle;
