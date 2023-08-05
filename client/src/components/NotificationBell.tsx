import React, { useState } from 'react';

function NotificationBell() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);

  const handleBellClick = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  // Separate click handler for the SVG icon
  const handleIconClick = (event: any) => {
    event.stopPropagation(); // Prevent the bell button's click event from being triggered
    setIsDropdownOpen((prevState) => !prevState);
  };

  return (
    <div className="">
      <button
        className="inline-flex items-center text-center text-sm font-medium text-gray-500 hover:text-gray-900 focus:outline-none dark:text-gray-400 dark:hover:text-white"
        type="button"
        onClick={handleBellClick}
      >
        <button type="button" className="h-5 w-5" onClick={handleIconClick}>
          <svg aria-hidden="true" fill="currentColor" viewBox="0 0 14 20">
            <svg
              className="h-5 w-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 14 20"
            >
              <path d="M12.133 10.632v-1.8A5.406 5.406 0 0 0 7.979 3.57.946.946 0 0 0 8 3.464V1.1a1 1 0 0 0-2 0v2.364a.946.946 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C1.867 13.018 0 13.614 0 14.807 0 15.4 0 16 .538 16h12.924C14 16 14 15.4 14 14.807c0-1.193-1.867-1.789-1.867-4.175ZM3.823 17a3.453 3.453 0 0 0 6.354 0H3.823Z" />
            </svg>
          </svg>
        </button>
        <div className="relative flex">
          <div className="relative -top-2 right-3 inline-flex h-3 w-3 rounded-full border-2 border-white bg-red-500 dark:border-gray-900"></div>
        </div>
      </button>
      {isDropdownOpen && (
        <div
          className="absolute right-1 z-20 divide-gray-100 rounded-lg bg-white shadow dark:divide-gray-700 dark:bg-gray-800"
          aria-labelledby="dropdownNotificationButton"
        >
          <div className="block rounded-t-lg bg-gray-50 px-4 py-2 text-center font-medium text-gray-700 dark:bg-gray-800 dark:text-white">
            Notifications
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            <a
              href="#"
              className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="flex-shrink-0">
                <img
                  className="h-11 w-11 rounded-full"
                  src="https://media.licdn.com/dms/image/C4D03AQE44r2JRBOBwg/profile-displayphoto-shrink_400_400/0/1647455149664?e=1696464000&v=beta&t=J_WH7oos20NLGt8ZTu7WD-ih7DUmvZKfoC5DxtLRh4s"
                  alt="Jese image"
                />
              </div>
              <div className="w-full pl-3">
                <div className="mb-1.5 text-sm text-gray-500 dark:text-gray-400">
                  New Friend Request from{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Carlos Duque
                  </span>
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-500">
                  a few moments ago
                </div>
              </div>
            </a>
            <a
              href="#"
              className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="flex-shrink-0">
                <img
                  className="h-11 w-11 rounded-full"
                  src="https://media.licdn.com/dms/image/C4D03AQE44r2JRBOBwg/profile-displayphoto-shrink_400_400/0/1647455149664?e=1696464000&v=beta&t=J_WH7oos20NLGt8ZTu7WD-ih7DUmvZKfoC5DxtLRh4s"
                  alt="Jese image"
                />
              </div>
              <div className="w-full pl-3">
                <div className="mb-1.5 text-sm text-gray-500 dark:text-gray-400">
                  New Friend Request from{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Carlos Duque
                  </span>
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-500">
                  a few moments ago
                </div>
              </div>
            </a>
            <a
              href="#"
              className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="flex-shrink-0">
                <img
                  className="h-11 w-11 rounded-full"
                  src="https://media.licdn.com/dms/image/C4D03AQE44r2JRBOBwg/profile-displayphoto-shrink_400_400/0/1647455149664?e=1696464000&v=beta&t=J_WH7oos20NLGt8ZTu7WD-ih7DUmvZKfoC5DxtLRh4s"
                  alt="Jese image"
                />
              </div>
              <div className="w-full pl-3">
                <div className="mb-1.5 text-sm text-gray-500 dark:text-gray-400">
                  New Friend Request from{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Carlos Duque
                  </span>
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-500">
                  a few moments ago
                </div>
              </div>
            </a>
            <a
              href="#"
              className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="flex-shrink-0">
                <img
                  className="h-11 w-11 rounded-full"
                  src="https://media.licdn.com/dms/image/C4D03AQE44r2JRBOBwg/profile-displayphoto-shrink_400_400/0/1647455149664?e=1696464000&v=beta&t=J_WH7oos20NLGt8ZTu7WD-ih7DUmvZKfoC5DxtLRh4s"
                  alt="Jese image"
                />
              </div>
              <div className="w-full pl-3">
                <div className="mb-1.5 text-sm text-gray-500 dark:text-gray-400">
                  New Friend Request from{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Carlos Duque
                  </span>
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-500">
                  a few moments ago
                </div>
              </div>
            </a>
            <a
              href="#"
              className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="flex-shrink-0">
                <img
                  className="h-11 w-11 rounded-full"
                  src="https://media.licdn.com/dms/image/C4D03AQE44r2JRBOBwg/profile-displayphoto-shrink_400_400/0/1647455149664?e=1696464000&v=beta&t=J_WH7oos20NLGt8ZTu7WD-ih7DUmvZKfoC5DxtLRh4s"
                  alt="Jese image"
                />
              </div>
              <div className="w-full pl-3">
                <div className="mb-1.5 text-sm text-gray-500 dark:text-gray-400">
                  New Friend Request from{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Carlos Duque
                  </span>
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-500">
                  a few moments ago
                </div>
              </div>
            </a>
            <a
              href="#"
              className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="flex-shrink-0">
                <img
                  className="h-11 w-11 rounded-full"
                  src="https://media.licdn.com/dms/image/C4D03AQE44r2JRBOBwg/profile-displayphoto-shrink_400_400/0/1647455149664?e=1696464000&v=beta&t=J_WH7oos20NLGt8ZTu7WD-ih7DUmvZKfoC5DxtLRh4s"
                  alt="Jese image"
                />
              </div>
              <div className="w-full pl-3">
                <div className="mb-1.5 text-sm text-gray-500 dark:text-gray-400">
                  New Friend Request from{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Carlos Duque
                  </span>
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-500">
                  a few moments ago
                </div>
              </div>
            </a>
            <a
              href="#"
              className="block rounded-b-lg bg-gray-50 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            >
              <div className="inline-flex items-center ">
                <svg
                  className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 14"
                >
                  <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                </svg>
                View all
              </div>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
