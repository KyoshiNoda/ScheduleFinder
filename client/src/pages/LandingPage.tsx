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
      <div className="slate-50 flex flex-col gap-4">
        <h1 className="flex justify-center text-4xl dark:text-white">
          Schedule Finder
        </h1>
        <p className="flex justify-center px-1 text-center text-sm font-medium dark:text-white">
          Easily create schedules to see your friends. Discover new people
          within your free time periods.
        </p>
        <div className="my-6 flex flex-col gap-6">
          <img src={scheduleImg} className="max-w-screen-sm text-center" />
          <div className="space-y-3">
            <Link
              className="flex h-1/2  w-full items-center justify-center rounded-full bg-blue-600  px-8 py-3 text-xl font-semibold text-white dark:bg-blue-800"
              to={'/signup'}
            >
              Get Started
            </Link>
            <Link
              className="flex h-1/2  w-full items-center justify-center rounded-full bg-blue-600  px-8 py-3 text-xl font-semibold text-white dark:bg-blue-800"
              to={'/login'}
            >
              Login
            </Link>
          </div>
        </div>
        <a
          className="w-3 cursor-pointer"
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
