import { useEffect, useState } from 'react';
import Toggle from '../components/Toggle';
import scheduleImg from '../assets/schedule.png';
import { AiFillGithub } from 'react-icons/ai';
import { Link } from 'react-router-dom';
type Props = {};

function Homepage({}: Props) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [theme, setTheme] = useState<string>(
    mediaQuery.matches ? 'white' : 'black'
  );
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <div className="flex min-h-full w-screen flex-col gap-10 bg-slate-100 p-3 dark:bg-slate-900">
      <div>
        <div className="flex justify-end">
          <Toggle getTheme={(theme) => setTheme(theme)} />
        </div>
      </div>
      {width < 640 ? (
        <div className="slate-50 flex flex-col gap-4">
          <div className="flex justify-center text-5xl dark:text-white">
            ScheduleFinder
          </div>
          <p className="flex justify-center p-3 font-medium dark:text-white">
            Easily create schedules to see your friends. <br />
            Discover new people within your free time periods.
          </p>
          <div className="flex justify-center gap-1">
            <button
              type="submit"
              form="changes"
              className="w-1/2 rounded-full bg-blue-600 px-8 py-3 font-semibold text-white"
            >
              Get Started
            </button>
            <a
              className="w-3 cursor-pointer"
              href={'https://github.com/KyoshiNoda/ScheduleFinder'}
            >
              <AiFillGithub size={'96'} color={`${theme}`} />
            </a>
          </div>
          <img src={scheduleImg} className="max-w-screen-sm text-center" />
          <div className="flex justify-center gap-1">
            <div className="self-center">
              <a
                className="flex h-1/2  w-full items-center justify-center rounded-full bg-blue-600  px-8 py-3 text-xl font-semibold text-white dark:bg-blue-800"
                href={'/signup'}
              >
                Get Started
              </a>
            </div>

            <div>
              <a
                className="w-3 cursor-pointer"
                href={'https://github.com/KyoshiNoda/ScheduleFinder'}
              >
                <AiFillGithub size={'96'} color={`${theme}`} />
              </a>
            </div>
            <div className="self-center">
              <a
                className="flex h-1/2  w-full items-center justify-center rounded-full bg-blue-600  px-8 py-3 text-xl font-semibold text-white dark:bg-blue-800"
                href={'/login'}
              >
                Login
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="flex items-center p-7">
            <div className="mr-1 w-1/2 flex-1 items-center">
              <img src={scheduleImg} className="inline-block w-full max-w-md" />
            </div>
            <div className="ml-60 flex flex-1 flex-col items-center justify-center text-5xl dark:text-white lg:text-7xl">
              <div className="my-auto">ScheduleFinder</div>
            </div>
          </div>
          <div className="flex p-3">
            <div className="inline-block w-1/2">
              <p className="text-2xl font-medium  dark:text-white">
                Easily create schedules to see your friends. <br />
                Discover new people within your free time periods.
              </p>
            </div>
            <div className="ml-56 flex w-1/2 flex-col gap-2">
              <a
                className="flex h-1/2 w-full items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-xl font-semibold text-white dark:bg-blue-800"
                href={'/signup'}
              >
                Get Started
              </a>
              <a
                className="flex h-1/2  w-full items-center justify-center rounded-full bg-blue-600  px-8 py-3 text-xl font-semibold text-white dark:bg-blue-800"
                href={'/login'}
              >
                Login
              </a>
            </div>
          </div>
          <a
            className="w-3 cursor-pointer"
            href={'https://github.com/KyoshiNoda/ScheduleFinder'}
          >
            <AiFillGithub size={'96'} color={`${theme}`} />
          </a>
        </div>
      )}
    </div>
  );
}

export default Homepage;
