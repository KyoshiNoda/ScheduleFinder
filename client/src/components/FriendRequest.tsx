import { useEffect, useState } from 'react';
import { FaUserFriends } from 'react-icons/fa';
import { AiOutlineCheck } from 'react-icons/ai';
import {
  useGetUserFriendRequestsQuery,
  useAcceptFriendRequestMutation,
  useRejectFriendRequestMutation,
} from '../redux/services/user/userService';
import { User as UserType } from '../types';
import { Spinner } from 'flowbite-react';
function FriendRequest() {
  const { data, isLoading } = useGetUserFriendRequestsQuery('User');
  const [friendRequests, setFriendRequests] = useState<UserType[]>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [acceptFriendRequest] = useAcceptFriendRequestMutation();
  const [rejectFriendRequest] = useRejectFriendRequestMutation();
  useEffect(() => {
    if (data && !isLoading) {
      setFriendRequests(data);
    }
  }, [data, isLoading]);

  const handleBellClick = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleIconClick = (event: any) => {
    event.stopPropagation();
    setIsDropdownOpen((prevState) => !prevState);
  };

  const acceptFriendRequestHandler = async (id: string) => {
    try {
      await acceptFriendRequest({ friendID: id });
    } catch (error: any) {
      console.log(error);
    }
  };

  const rejectFriendRequestHandler = async (id: string) => {
    try {
      await rejectFriendRequest({ friendID: id });
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div>
      <button
        className="inline-flex items-center text-center text-sm font-medium text-gray-500 hover:text-gray-900 focus:outline-none dark:text-gray-400 dark:hover:text-white"
        type="button"
        onClick={handleBellClick}
      >
        <button type="button" className="h-5 w-5" onClick={handleIconClick}>
          <FaUserFriends size="32" onClick={handleIconClick} />
        </button>
      </button>
      {isDropdownOpen && (
        <div className="absolute right-16 z-20 w-3/4 divide-gray-100 rounded-lg bg-white shadow dark:divide-gray-700 dark:bg-gray-800 lg:right-1 lg:w-1/4">
          <div className="block rounded-t-lg bg-gray-50 px-4 py-2 text-center font-medium text-gray-700 dark:bg-gray-800 dark:text-white">
            Friend Requests
          </div>
          <div className="mx-4 flex-col items-center">
            {friendRequests ? (
              friendRequests.map((user) => {
                return (
                  <div className="mb-3 flex gap-4 ">
                    <img
                      className="h-11 w-11 rounded-full border shadow-lg dark:border-gray-700 dark:bg-gray-500"
                      src={user.photoURL}
                      alt="user image"
                    />
                    <div>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {user.firstName} {user.lastName}
                      </span>
                      <div className=" text-sm text-blue-600 dark:text-blue-500">
                        {user.school}
                      </div>
                    </div>
                    <div className="flex-grow" />
                    <div className="m-auto flex items-center gap-1">
                      <button
                        type="button"
                        className="rounded-lg bg-green-600 px-1 py-1 font-semibold text-white hover:bg-green-500"
                        onClick={() => acceptFriendRequestHandler(user._id)}
                      >
                        <AiOutlineCheck />
                      </button>
                      <button
                        type="button"
                        className="rounded-lg bg-red-600 px-2 text-white hover:bg-rose-500"
                        onClick={() => rejectFriendRequestHandler(user._id)}
                      >
                        X
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <Spinner aria-label="Extra small spinner example" size="xl" />
            )}
          </div>
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
      )}
    </div>
  );
}

export default FriendRequest;
