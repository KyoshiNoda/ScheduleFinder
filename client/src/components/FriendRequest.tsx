import { useEffect, useState } from 'react';
import { FaBell } from "react-icons/fa";
import { AiOutlineCheck } from 'react-icons/ai';
import { useGetUserFriendRequestsQuery, useAcceptFriendRequestMutation, useRejectFriendRequestMutation } from '../redux/services/user/userService';
import { User as UserType } from '../types';
import { Spinner } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { useToast } from '../utils/functions';
import { ToastEnum } from '../enums';
const FriendRequest = () => {
  const { showToast } = useToast();
  const { data, isLoading } = useGetUserFriendRequestsQuery('User');
  const [receivedFriendRequests, setReceivedFriendRequests] = useState<UserType[]>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [acceptFriendRequest] = useAcceptFriendRequestMutation();
  const [rejectFriendRequest] = useRejectFriendRequestMutation();
  useEffect(() => {
    if (data && !isLoading) {
      setReceivedFriendRequests(data);
    }
  }, [data, isLoading]);

  const handleBellClick = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleIconClick = (event: React.MouseEvent<SVGElement>) => {
    event.stopPropagation();
    setIsDropdownOpen((prevState) => !prevState);
  };

  const acceptFriendRequestHandler = async (id: string) => {
    try {
      await acceptFriendRequest({ friendID: id });
      showToast(ToastEnum.ACCEPTED_FRIEND_REQUEST);
    } catch (error: any) {
      console.log(error);
    }
  };

  const rejectFriendRequestHandler = async (id: string) => {
    try {
      await rejectFriendRequest({ friendID: id });
      showToast(ToastEnum.REJECTED_FRIEND_REQUEST);
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
        <FaBell onClick={handleIconClick} className="h-7 w-7 mt-2" />
      </button>
      {isDropdownOpen && (
        <div className="absolute right-4 z-20 w-3/4 divide-gray-100 rounded-lg bg-white shadow dark:divide-gray-700 dark:bg-gray-800 lg:right-1 lg:w-1/4">
          <div className="block rounded-t-lg bg-gray-50 px-4 py-2 text-center font-medium text-gray-700 dark:bg-gray-800 dark:text-white">
            Friend Requests
          </div>
          <div className="mx-4 flex-col items-center">
            {receivedFriendRequests ? (
              receivedFriendRequests.map((user) => {
                return (
                  <div className="mb-3 flex gap-4 " key={user._id}>
                    <img
                      className="h-11 w-11 rounded-full border shadow-lg dark:border-gray-700 dark:bg-gray-500"
                      src={user.photoURL}
                      alt="user image"
                    />
                    <div>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {user.firstName} {user.lastName}
                      </span>
                      <div className=" text-sm text-blue-600 dark:text-blue-500">{user.school}</div>
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
              <Spinner aria-label="Friend Request Spinner" size="xl" />
            )}
          </div>
          <Link
            to="/auth/notifications"
            className="block rounded-b-lg bg-gray-50 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            onClick={() => setIsDropdownOpen(false)}
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
          </Link>
        </div>
      )}
    </div>
  );
};

export default FriendRequest;
