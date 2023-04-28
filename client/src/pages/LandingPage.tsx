import { useState } from 'react';
import Toggle from '../components/Toggle';
import scheduleImg from '../assets/schedule.png';
import { AiFillGithub } from 'react-icons/ai';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const [theme, setTheme] = useState<string>(
    mediaQuery.matches ? 'white' : 'black'
  );

  return (
    <div className="flex min-h-full w-full flex-col gap-6 bg-slate-100 p-3 dark:bg-slate-900">
      <div className="flex justify-end">
        <Toggle getTheme={(theme) => setTheme(theme)} />
      </div>
      <div className="slate-50 flex flex-col gap-4 sm:gap-8 sm:px-14 md:gap-14 lg:grid lg:grid-cols-2 lg:gap-0 lg:gap-x-14 2xl:mt-20">
        <div className=" flex flex-col gap-y-3 sm:gap-y-6 lg:mb-40 lg:justify-center lg:self-center">
          <h1 className="flex justify-center text-center text-4xl dark:text-white sm:text-6xl md:text-8xl lg:text-6xl xl:text-7xl 2xl:text-8xl">
            Schedule Finder
          </h1>
          <p className="flex justify-center px-1 text-center text-sm dark:text-white sm:text-xl md:text-3xl lg:px-0 lg:text-xl 2xl:text-2xl">
            Easily create and compare your schedule with others. Discover new people within your free time periods.
          </p>
        </div>
        <div className="my-6 flex flex-col gap-6 md:gap-20 lg:my-0 lg:gap-0 lg:space-y-14">
          <img src={scheduleImg} className="w-4/5 self-center lg:w-4/6" />
          <div className="space-y-3 sm:space-y-5">
            <Link
              className="flex h-1/2 w-full items-center justify-center rounded-full bg-blue-600 px-8 py-3  text-xl font-semibold text-white dark:bg-blue-800 md:text-2xl lg:h-1/3 lg:text-lg xl:h-2/5 xl:text-xl 2xl:h-3/6 2xl:text-2xl"
              to={'/signup'}
            >
              Get Started
            </Link>
            <Link
              className="flex h-1/2 w-full  items-center justify-center rounded-full bg-blue-600 px-8 py-3  text-xl font-semibold text-white dark:bg-blue-800 md:text-2xl lg:h-1/3 lg:text-lg xl:h-2/5 xl:text-xl 2xl:h-3/6 2xl:text-2xl"
              to={'/login'}
            >
              Login
            </Link>
          </div>
        </div>
        <a
          className="cursor-pointer"
          href="https://github.com/KyoshiNoda/ScheduleFinder"
          target="_blank"
        >
          <AiFillGithub size={'50'} color={`${theme}`} />
        </a>
      </div>
    </div>
  );
};

export default LandingPage;
