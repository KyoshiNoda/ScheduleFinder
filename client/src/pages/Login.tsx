import LoginBox from '../components/Login/LoginBox';
import hero2 from '../assets/plsWork.png';
import Toggle from '../components/Toggle'
type Props = {};

function Login({ }: Props) {
  return (

    <div className="flex flex-col h-screen w-screen gap-40 p-3 bg-slate-400 dark:bg-slate-900">
      <div className='flex justify-end'>
        <Toggle />
      </div>
      <div className='flex items-center'>
        <div className='flex w-3/5 h-full justify-center items-center'>
          <LoginBox />
        </div>
        <div className="flex h-full items-center p-3">
          <img src={hero2} className="h-96" />
        </div>
      </div>
    </div>

  );
}

export default Login;
