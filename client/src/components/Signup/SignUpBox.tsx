import SignUpForm from './SignUpForm';
import GoogleAuth from '../Auth/GoogleAuth';
type Props = {};

function SignUpBox({}: Props) {
  return (
    <div className='flex w-1/3 flex-col bg-gray-100 dark:bg-slate-800  rounded-lg p-10 dark:text-gray-100'>
      <div className='flex justify-center text-5xl mb-5 dark:text-white'>
        Sign up
      </div>
      <SignUpForm/> 
      <div className="flex items-center pt-4 space-x-1">
        <div className="flex-1 h-px sm:w-16 bg-gray-900 dark:bg-gray-700"></div>
        <p className="px-3 text-sm dark:text-gray-400">
          Login with Google
        </p>
        <div className="flex-1 h-px sm:w-16 bg-gray-900 dark:bg-gray-700"></div>
      </div>
      <GoogleAuth/>
    </div>
  );
}

export default SignUpBox;
