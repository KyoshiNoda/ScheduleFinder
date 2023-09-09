import LoginForm from './LoginForm';
import GoogleAuth from '../Auth/GoogleAuth';
import { Link } from 'react-router-dom';
const LoginBox = () => {
  return (
    <div className="w-full max-w-md space-y-3 rounded-xl bg-gray-100 p-8 dark:bg-slate-800 dark:text-gray-100 ">
      <h1 className="text-md text-center font-bold md:text-2xl">Login</h1>
      <LoginForm />
      {/* <div className="flex items-center space-x-1 pt-4">
        <div className="h-px flex-1 bg-gray-900 dark:bg-gray-700 sm:w-16"></div>
        <p className="px-3 text-sm dark:text-gray-400">
          Login with social accounts
        </p>
      </div> */}
      {/* <GoogleAuth /> */}
      <div className="mt-3 flex items-center justify-center gap-1 text-center text-xs dark:text-gray-400">
        <p className="text-center text-xs dark:text-gray-400">
          Don't have an account?
        </p>
        <Link
          rel="noopener noreferrer"
          to="/signup"
          className="inline-block underline dark:text-gray-100"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default LoginBox;
