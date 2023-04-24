import { Card } from 'flowbite-react';

const LoadingUser = () => {
  return (
    <div className="max-w-sm">
      <Card>
        <div className="flex flex-col items-center">
          <div className="is-loading dark:dark-gradient mb-3 h-32 w-32 rounded-full bg-white"></div>
          <div className="is-loading dark:dark-gradient rounded mb-1 text-xl font-medium text-gray-900 dark:text-white">
            <span className="opacity-0">lorem ipsum</span>
          </div>
          <span className="is-loading dark:dark-gradient rounded mb-1 text-sm text-gray-500 dark:text-gray-400">
            <span className="opacity-0">lorem ipsum</span>
          </span>
          <span className="is-loading dark:dark-gradient rounded text-sm text-gray-500 dark:text-gray-400">
            <span className="opacity-0">lorem ipsum</span>
          </span>
          <div className="mt-4 flex space-x-3 lg:mt-6">
            <div className="is-loading dark:dark-gradient inline-flex items-center rounded-lg bg-white py-2 px-4 text-center text-sm">
              <span className="opacity-0">Add friend</span>
            </div>
            <div className="is-loading dark:dark-gradient inline-flex items-center rounded-lg bg-white py-2 px-4 text-center text-sm font-medium focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700">
              <span className="opacity-0">See schedule</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoadingUser;
