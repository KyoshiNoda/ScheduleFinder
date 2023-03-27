import React from 'react'

type Props = {}

function LoginForm({}: Props) {
  return (
      <form action="" className="space-y-6 ng-untouched ng-pristine ng-valid">
        <div className="space-y-1 text-sm">
          <label htmlFor="email" className="block text-sm md:text-lg font-bold">
            Email
          </label>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="Email"
            className="w-full text-sm px-4 py-3 bg-gray-50 rounded-md border-gray-100  dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:dark:border-violet-400"
          />
        </div>

        <div className="space-y-1 text-sm">
          <label htmlFor="password" className="block text:sm md:text-lg font-bold">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            className="w-full px-4 py-3 text-sm rounded-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:dark:border-violet-400"
          />
          <div className="flex justify-end text-xs dark:text-gray-400">
            <a rel="noopener noreferrer" href="#">
              Forgot Password?
            </a>
          </div>

        </div>
        <button className="block w-full p-3 text-center rounded-sm bg-blue-400 text-white dark:text-gray-900 font-bold dark:bg-slate-300 ">
          Sign in
        </button>
      </form>
  )
}

export default LoginForm