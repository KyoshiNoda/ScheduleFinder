import { useState, useEffect } from 'react';
import { useGetUserInfoQuery } from '../../../redux/services/user/userService';
import ProfilePic from './ProfilePic';
function ProfileTab() {
  const { data, isLoading, isError } = useGetUserInfoQuery('User');
  const [userInfo, setUserInfo] = useState<any>();

  useEffect(() => {
    if (data && !isLoading) {
      setUserInfo(data[0]);
    }
  }, [data, isLoading]);

  return (
    <div>
      {userInfo ? (
        <>
          <div className="flex items-center gap-3 py-4">
            <ProfilePic picture={userInfo.photoURL} />
            <div className="font-md text-2xl dark:text-white">
              {userInfo.firstName} {userInfo.lastName}
            </div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="default-input"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Email
            </label>
            <input
              type="text"
              id="default-input"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder={userInfo.email}
            />
          </div>
          <div className="flex flex-col gap-3">
            <button
              type="button"
              className="w-full rounded bg-green-400 px-8 py-3 text-lg font-semibold text-white dark:bg-green-800"
            >
              Save Changes
            </button>

            <button
              type="button"
              className="w-full rounded bg-blue-400 px-8 py-3 text-lg font-semibold text-white dark:bg-blue-800"
            >
              Change Password
            </button>
            <button
              type="button"
              className="w-full rounded bg-red-400 px-8 py-3 text-lg font-semibold text-white dark:bg-red-800"
            >
              Delete My Account
            </button>
          </div>
        </>
      ) : isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>User information not available.</div>
      )}
    </div>
  );
}

export default ProfileTab;
