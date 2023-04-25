import { useEffect, useState } from 'react';
import Toggle from '../components/Toggle';
import SignUpBox from '../components/Signup/SignUpBox';
import pic1 from '../assets/loggingOn.png';
import pic2 from '../assets/wavy-man-creating-a-website.png';

type Props = {};

function Signup({ }: Props) {

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
    <div className="flex flex-col min-h-screen w-screen gap-3 md:gap-30 bg-slate-400 dark:bg-slate-900">
      <div className="flex justify-end">
        <Toggle />
      </div>
      <div className="flex justify-evenly">
        {width >= 768 && (
          <div className="flex items-center">
            <img src={pic1} className="h-96" />
          </div>
        )}

        <SignUpBox />
        {width >= 768 && (
          <div className="flex items-center">
            <img src={pic2} className="h-96" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Signup;
