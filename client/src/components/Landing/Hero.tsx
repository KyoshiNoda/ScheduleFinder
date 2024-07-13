import compareSchedule from '../../assets/compareSchedule.png';
import { Link } from 'react-router-dom';
const Hero = () => {
  return (
    <div className="flex h-full flex-col items-center dark:text-white">
      <div className="flex h-full flex-col items-center justify-center gap-5">
        <h1 className="text-center text-4xl font-extrabold lg:text-8xl">
          Meet People
          <br />
          On Your Clock.
        </h1>
        <span className="text-md text-center font-bold text-gray-500 dark:text-gray-400 lg:text-xl">
          Create schedules, compare with friends, <br />
          and discover new connections.
        </span>
        <Link
          to="/signup"
          className="text-md md:rounded-5xl rounded-xl bg-blue-600 px-3 py-2 font-bold text-white dark:bg-blue-800 md:px-16 md:py-3 md:text-2xl"
        >
          Get Started
        </Link>
        <img src={compareSchedule} className="w-full rounded-xl bg-gray-400 p-1" />
      </div>
    </div>
  );
};

export default Hero;
