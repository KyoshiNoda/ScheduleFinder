import React from 'react';
import LoginForm from './LoginForm';
import LoginGoogle from './LoginGoogle';
type Props = {};

function LoginBox({ }: Props) {
  return (
    <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-gray-100 dark:bg-slate-800 dark:text-gray-100 ">
      <h1 className="text-2xl font-bold text-center">Login</h1>
      <LoginForm/>
      <div className="flex items-center pt-4 space-x-1">
        <div className="flex-1 h-px sm:w-16 bg-gray-900 dark:bg-gray-700"></div>
        <p className="px-3 text-sm dark:text-gray-400">
          Login with social accounts
        </p>
        <div className="flex-1 h-px sm:w-16 bg-gray-900 dark:bg-gray-700"></div>
      </div>
      <LoginGoogle/>
      <p className="text-xs text-center sm:px-6 dark:text-gray-400">
        Don't have an account? { }
        <a
          rel="noopener noreferrer"
          href="#"
          className="underline dark:text-gray-100"
        >
          Sign up
        </a>
      </p>
    </div>
  );
}

export default LoginBox;
