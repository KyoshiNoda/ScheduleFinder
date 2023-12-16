import { Card } from 'flowbite-react';
import { Link } from 'react-router-dom';
import {
  useSendFriendRequestMutation,
  useAcceptFriendRequestMutation,
  useRemovePendingFriendRequestMutation,
} from '../../redux/services/user/userService';
import { BiTime } from 'react-icons/bi';
import { useState } from 'react';
import { useToast } from '../../utils/functions';
import { FriendsEnum } from '../../types';
type UserProps = {
  id: string;
  photoURL: string;
  firstName: string;
  lastName: string;
  school: string;
  major: string | undefined;
  isPending: boolean;
  isFriendRequest: boolean;
  isFriends: boolean;
};

const User = ({
  id,
  photoURL,
  firstName,
  lastName,
  school,
  major,
  isPending,
  isFriendRequest,
  isFriends,
}: UserProps) => {
  const { showToast } = useToast();
  const [sendFriendRequest] = useSendFriendRequestMutation();
  const [acceptFriendRequest] = useAcceptFriendRequestMutation();
  const [removeSendFriendRequest] = useRemovePendingFriendRequestMutation();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const fullName = `${firstName} ${lastName}`;

  const sendFriendRequestHandler = async (id: string) => {
    await sendFriendRequest({ friendID: id });
    showToast(FriendsEnum.SEND_REQUEST);
  };

  const acceptFriendRequestHandler = async (id: string) => {
    await acceptFriendRequest({ friendID: id });
    showToast(FriendsEnum.ACCEPTED_REQUEST);
  };

  const cancelFriendRequestHandler = async (id: string) => {
    await removeSendFriendRequest({ friendID: id });
    showToast(FriendsEnum.CANCEL_REQUEST);
  };

  return (
    <div className="max-w-sm">
      <Card>
        <div className="flex flex-col items-center">
          <img
            className="mb-3 max-h-32 w-32 rounded-full object-cover shadow-lg"
            src={photoURL}
            alt={`Profile picture of ${fullName}`}
          />
          <h2 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
            {fullName}
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {major}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {school}
          </span>
          <div className="mt-4 flex space-x-3 lg:mt-6">
            {!isPending ? (
              isFriendRequest ? (
                <button
                  onClick={() => acceptFriendRequestHandler(id)}
                  className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
                >
                  Accept Friend Request
                </button>
              ) : (
                <>
                  {!isFriends && (
                    <button
                      onClick={() => sendFriendRequestHandler(id)}
                      className="inline-flex items-center rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Add Friend
                    </button>
                  )}
                </>
              )
            ) : (
              <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {isHovered ? (
                  <button
                    onClick={() => cancelFriendRequestHandler(id)}
                    className="inline-flex items-center rounded-lg bg-red-600 px-1 py-2 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
                  >
                    Cancel Request
                  </button>
                ) : (
                  <span className="flex items-center gap-1 rounded border px-4 py-2 dark:text-white">
                    Pending <BiTime size="20" />
                  </span>
                )}
              </div>
            )}
            <Link
              to={`/auth/compareSchedule/${id}`}
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
            >
              See schedule
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};



export default User;
