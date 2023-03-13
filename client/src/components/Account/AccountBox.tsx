import React from 'react'
import Tab from './Tab';
import ProfilePic from './ProfilePic';
import Edit from '../Logos/Edit';
type Props = {}

function AccountBox({}: Props) {
  return (
    <div className="bg-gray-100 dark:bg-slate-800 w-2/5 rounded-lg p-4">
    <Tab />
    <div className="flex items-center gap-3 p-3">
      <ProfilePic />
      <div className='dark:text-white text-2xl font-md'>
        Kyoshi Noda
      </div>
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
        className="text-lg w-full px-8 py-3 font-semibold rounded bg-green-400 text-white dark:bg-green-800"
      >
        Save Changes
      </button>
      
      <button
        type="button"
        className="text-lg w-full px-8 py-3 font-semibold rounded bg-blue-400 text-white dark:bg-blue-800"
      >
        Change Password
      </button>
      <button
        type="button"
        className="text-lg w-full px-8 py-3 font-semibold rounded bg-red-400 text-white dark:bg-red-800"
      >
        Delete My Account
      </button>
    </div>
  </div>
  )
}

export default AccountBox