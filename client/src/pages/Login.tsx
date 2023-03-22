import { useState, useEffect } from 'react';
import LoginBox from '../components/Login/LoginBox';
import hero2 from '../assets/plsWork.png';
import Toggle from '../components/Toggle';

type Props = {};

function Login({}: Props) {
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
    <div className="flex flex-col min-h-full w-screen gap-10 lg:gap-40 p-3 bg-slate-400 dark:bg-slate-900">
      <div className="flex justify-end">
        <Toggle />
      </div>
      <div className="flex items-center">
        <div className="flex w-full md:w-3/5 h-min-h-full justify-center items-center">
          <LoginBox />
        </div>
        {width >= 768 && (
          <div className='flex h-full items-center p-3'>
            <img src={hero2} className="h-96" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
