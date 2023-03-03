import LoginBox from '../components/Login/LoginBox';
import hero2 from '../assets/plsWork.png';
type Props = {};

function Login({}: Props) {
  return (
    <div className="flex items-center h-screen w-screen bg-slate-500">
      
      <div className='flex w-3/5 h-full justify-center items-center'>
        <LoginBox/>
      </div>

      <div className = "flex h-full items-center p-3">
        <img src={hero2} className="h-96" />
      </div>
    </div>
  );
}

export default Login;
