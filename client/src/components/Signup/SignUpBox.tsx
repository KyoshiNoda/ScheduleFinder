import SignUpForm from './SignUpForm';
import GoogleAuth from '../Auth/GoogleAuth';
import { Link } from 'react-router-dom';

const   SignUpBox = () => {
  return (
    <div className="flex h-full w-5/6 flex-col rounded-lg bg-white shadow border dark:shadow-none dark:border-none p-5 dark:bg-slate-800  dark:text-gray-100 md:w-2/3 lg:w-1/3">
      <div className="mb-5 flex justify-center text-4xl dark:text-white md:text-5xl">
        Sign up
      </div>
      <SignUpForm />
      {/* <div className="flex items-center space-x-1 pt-4">
        <div className="h-px flex-1 bg-gray-900 dark:bg-gray-700 sm:w-16"></div>
        <p className="px-3 text-sm dark:text-gray-400">Login with Google</p>
        <div className="h-px flex-1 bg-gray-900 dark:bg-gray-700 sm:w-16"></div>
      </div>
      <GoogleAuth /> */}
      <div className="mt-3 flex items-center justify-center gap-1 text-center text-xs dark:text-gray-400">
        <p className="text-center text-xs dark:text-gray-400">
          Have an account?
        </p>
        <Link
          to="/login"
          className="inline-block underline dark:text-gray-100"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default SignUpBox;
