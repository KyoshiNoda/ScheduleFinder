import { useState } from 'react';
import { Label } from 'flowbite-react';
import Toggle from '../components/Toggle';

function ForgotPassword() {
  const [isValidEmail, setIsValidEmail] = useState<boolean>(false);
  const checkEmailHandler = () =>{
    // run logic code here
  }
  return (
    <div className="flex min-h-full w-screen flex-col gap-10 bg-slate-400 p-3 dark:bg-slate-900 lg:gap-40">
      <div className="flex justify-end">
        <Toggle />
      </div>
      <div className="flex items-center justify-center">
        <div className="flex w-1/3 flex-col justify-center rounded-lg bg-white dark:bg-slate-400 p-5 gap-10">
          <div className="flex justify-center text-4xl">Reset Password</div>
          <div className="flex justify-center">
            <label
              htmlFor="school"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            ></label>
            <input
              type="text"
              name="email"
              id="email"
              placeholder="johndoe@gmail.com"
              className={`w-1/2 rounded-md border-gray-500 bg-gray-50 px-4 py-3 text-sm dark:border-gray-100 dark:bg-gray-900 dark:text-gray-100 focus:dark:border-blue-400 ${
                isValidEmail ? 'border-rose-500' : ''
              }`}
            />
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              className="w-1/2 rounded-full bg-blue-400 px-8 py-3 text-lg font-semibold text-white dark:bg-slate-300 dark:text-black"
              onClick={checkEmailHandler}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
