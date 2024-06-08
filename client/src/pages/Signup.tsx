import { useEffect, useState } from 'react';
import Toggle from '../components/Toggle';
import SignUpBox from '../components/Signup/SignUpBox';
import pic1 from '../assets/loggingOn.png';
import pic2 from '../assets/wavy-man-creating-a-website.png';

const Signup = () => {
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
    <div className="md:gap-30 flex min-h-screen flex-col gap-3 bg-slate-50 py-5 dark:bg-slate-900 lg:px-4">
      <div className="flex justify-end py-5 px-8">
        <Toggle />
      </div>
      <div className="my-auto flex justify-evenly">
        {width >= 1024 && (
          <div className="flex items-center">
            <img src={pic1} className="h-96" />
          </div>
        )}

        <SignUpBox />

        {width >= 1024 && (
          <div className="flex items-center">
            <img src={pic2} className="h-96" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
