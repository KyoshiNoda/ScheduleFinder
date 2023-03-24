import { useEffect, useState } from 'react';
import Toggle from '../components/Toggle';
import scheduleImg from '../assets/schedule.png';
import { AiFillGithub } from 'react-icons/ai';
type Props = {};

function Homepage({ }: Props) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [theme, setTheme] = useState<string>(mediaQuery.matches ? 'white' : 'black');
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
          <p className="flex justify-center p-3 dark:text-white font-medium">
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
            <a className='cursor-pointer w-3' href={'https://github.com/KyoshiNoda/ScheduleFinder'}>
              <AiFillGithub size={'96'} color={`${theme}`} />
            </a>
          </div>
          <img src={scheduleImg} className="max-w-screen-sm text-center" />
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="p-7 flex items-center">
            <div className="flex-1 mr-1 items-center w-1/2">
              <img src={scheduleImg} className="inline-block w-full max-w-md" />
            </div>
            <div className="flex-1 flex flex-col justify-center items-center text-5xl lg:text-7xl dark:text-white">
              <div className="my-auto">ScheduleFinder</div>
            </div>
          </div>
          <div className="flex gap-28 p-3">
            <div className='w-1/2 inline-block'>
              <p className="dark:text-white text-lg  font-medium">
                Easily create schedules to see your friends. <br />
                Discover new people within your free time periods.
              </p>
            </div>
            <a
              className="flex justify-center w-2/5 float-right rounded-full bg-blue-600 px-8 py-3 text-xl font-semibold text-white"
              href={'/signup'}
            >
              Get Started
            </a>
          </div>
          <a className='cursor-pointer w-3' href={'https://github.com/KyoshiNoda/ScheduleFinder'}>
            <AiFillGithub size={'96'} color={`${theme}`} />
          </a>
        </div>
      )}
    </div>
  );
}

export default Homepage;
