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
    <div className="flex min-h-full w-screen flex-col gap-10 bg-slate-400 p-3 dark:bg-slate-900">
      <div className="flex justify-end">
        <Toggle />
      </div>
      <div className="flex items-center justify-center gap-32 lg:my-auto 2xl:justify-center">
        <LoginBox />
        {width >= 768 && (
          <div>
            <img src={hero2} className="h-96" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
