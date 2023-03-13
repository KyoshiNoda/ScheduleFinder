import React from 'react';

type Props = {};

function Tab({}: Props) {
  return (
    <div className="flex justify-center text-lg font-medium text-center text-gray-500 border-gray-200 dark:text-gray-400 dark:border-gray-700">
      <ul className="flex flex-wrap -mb-px">
      <li className="mr-10">
          <a
            href="#"
            className="inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg dark:text-blue-500 dark:border-blue-500"
            aria-current="page"
          >
            Profile
          </a>
        </li>
        <li className="mr-10">
          <a
            href="#"
            className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
          >
            Password
          </a>
        </li>
        <li className="mr-10">
          <a
            href="#"
            className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
          >
            Personal
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Tab;
