import React from 'react';
import Toggle from '../components/Toggle';
import Tab from '../components/Account/Tab';
import ProfilePic from '../components/Account/ProfilePic';
import Edit from '../components/Logos/Edit';
type Props = {};

function Account({}: Props) {
  return (
    <div className="flex flex-col h-screen w-screen gap-40 p-3 bg-slate-400 dark:bg-slate-900">
      <div className="flex justify-end">
        <Toggle />
      </div>
      <div className="flex justify-center">
        <div className=" bg-white w-1/2 p-4">
          <Tab />
          <div className="flex items-center gap-3 p-3">
            <ProfilePic />
            <Edit />
          </div>
          <div className="mb-6">
            <label
              htmlFor="default-input"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Username
            </label>
            <input
              type="text"
              id="default-input"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="default-input"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email
            </label>
            <input
              type="text"
              id="default-input"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className='flex flex-col gap-3'>
            <button
              type="button"
              className="text-lg w-full px-8 py-3 font-semibold rounded bg-green-400 text-white dark:bg-green-600"
            >
              Save Changes
            </button>
            <button
              type="button"
              className="text-lg w-full px-8 py-3 font-semibold rounded bg-red-400 text-white dark:bg-red-600"
            >
              Delete My Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
