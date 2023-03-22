import { useEffect, useState } from 'react';
import Toggle from '../components/Toggle';
import scheduleImg from '../assets/schedule.png';
import Github from '../components/Logos/Github';
type Props = {};

function Homepage({}: Props) {
  const [width, setWidth] = useState<number>(window.innerWidth);
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
    <div className="flex min-h-full w-screen flex-col gap-10 bg-slate-100 p-3 dark:bg-slate-900 lg:gap-40">
      <div>
        <div className="flex justify-end">
          <Toggle />
        </div>
      </div>
      {width < 640 ? (
        <div className="slate-50 flex flex-col gap-4">
          <div className="flex justify-center text-5xl dark:text-white">
            ScheduleFinder
          </div>
          <p className="flex justify-center p-5 dark:text-white">
            Easily create schedules to see your friends or make new friends
            within your free time periods.
          </p>
          <div className="flex justify-center">
            <button
              type="submit"
              form="changes"
              className="w-full rounded-full bg-blue-600 px-8 py-3 font-semibold text-white"
            >
              Get Started
            </button>
          </div>
          <img src={scheduleImg} className="max-w-screen-sm text-center" />
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="h-96 p-7">
            <img src={scheduleImg} className="inline-block" />
            <div className="float-right flex h-1/2 items-center text-5xl dark:text-white">
              ScheduleFinder
            </div>
          </div>
          <div className="flex">
            <p className="flex justify-center p-5 dark:text-white">
              Easily create schedules to see your friends or make new friends
              within your free time periods.
            </p>
            <button
              type="submit"
              form="changes"
              className="w-3/5 rounded-full bg-blue-600 px-8 py-3 text-xl font-semibold text-white"
            >
              Get Started
            </button>
          </div>
          <div className="flex gap-4 p-3">
            <Github />
            <Github />
          </div>
        </div>
      )}
    </div>
  );
}

export default Homepage;
