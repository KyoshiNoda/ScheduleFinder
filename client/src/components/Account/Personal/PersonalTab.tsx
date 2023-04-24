import { useState, useEffect } from 'react';
import { useGetUserInfoQuery } from '../../../redux/services/user/userService';
import { Dropdown } from 'flowbite-react';
import { User as UserType } from '../../../types';

function PersonalTab() {
  const { data, isLoading } = useGetUserInfoQuery('User');
  const [userInfo, setUserInfo] = useState<UserType | undefined>();
  useEffect(() => {
    if (data && !isLoading) {
      setUserInfo(data[0]);
    }
  }, [data, isLoading]);
  return (
    <>
      {userInfo ? (
        <div className="flex flex-col gap-6 sm:gap-28">
          <form id="changes">
            <div className="grid gap-3 sm:grid-cols-2 sm:grid-rows-3">
              <div>
                <label
                  htmlFor="first_name"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  First name
                </label>
                <input
                  type="text"
                  id="first_name"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder={userInfo!.firstName}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="last_name"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Last name
                </label>
                <input
                  type="text"
                  id="last_name"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder={userInfo!.lastName}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="school"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  School
                </label>
                <input
                  type="text"
                  id="school"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder={userInfo!.school}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="Major"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Major
                </label>
                <input
                  type="text"
                  id="Major"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder={userInfo!.major}
                  required
                />
              </div>
              <div className="flex items-end">
                <Dropdown label={userInfo!.gender} size="lg">
                  <Dropdown.Item>Male</Dropdown.Item>
                  <Dropdown.Item>Female</Dropdown.Item>
                  <Dropdown.Item>Binary</Dropdown.Item>
                  <Dropdown.Item>Transgender</Dropdown.Item>
                  <Dropdown.Item>Intersex</Dropdown.Item>
                  <Dropdown.Item>Other</Dropdown.Item>
                  <Dropdown.Item>I prefer not to say</Dropdown.Item>
                </Dropdown>
              </div>
              <div>
                <label
                  htmlFor="birthdate"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="birthdate"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </form>
          <button
            type="submit"
            form="changes"
            className="w-full rounded-full bg-blue-600 px-8 py-3 font-semibold text-white"
          >
            Save Changes
          </button>
        </div>
      ) : isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>User information not available.</div>
      )}
    </>
  );
}

export default PersonalTab;
