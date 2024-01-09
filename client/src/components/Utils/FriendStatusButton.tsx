import { useState } from 'react';
import { useToast } from '../../utils/functions';
import { ToastEnum } from '../../enums';
import { Link } from 'react-router-dom';
import { BiTime } from 'react-icons/bi';
import {
  useSendFriendRequestMutation,
  useAcceptFriendRequestMutation,
  useRemovePendingFriendRequestMutation,
} from '../../redux/services/user/userService';

type FriendStatusButtonProps = {
  userID: string;
  isPending: boolean;
  isFriendRequest: boolean;
  isFriends: boolean;
};
const FriendStatusButton = ({ isPending, isFriendRequest, isFriends, userID }: FriendStatusButtonProps) => {
  const { showToast } = useToast();
  const [sendFriendRequest] = useSendFriendRequestMutation();
  const [acceptFriendRequest] = useAcceptFriendRequestMutation();
  const [removeSendFriendRequest] = useRemovePendingFriendRequestMutation();
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const sendFriendRequestHandler = async (id: string) => {
    await sendFriendRequest({ friendID: id });
    showToast(ToastEnum.SEND_FRIEND_REQUEST);
  };

  const acceptFriendRequestHandler = async (id: string) => {
    await acceptFriendRequest({ friendID: id });
    showToast(ToastEnum.ACCEPTED_FRIEND_REQUEST);
  };

  const cancelFriendRequestHandler = async (id: string) => {
    await removeSendFriendRequest({ friendID: id });
    showToast(ToastEnum.CANCEL_FRIEND_REQUEST);
  };
  return (
    <div className="flex space-x-3">
      {!isPending ? (
        isFriendRequest ? (
          <button
            onClick={() => acceptFriendRequestHandler(userID)}
            className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
          >
            Accept Friend Request
          </button>
        ) : (
          <>
            {!isFriends && (
              <button
                onClick={() => sendFriendRequestHandler(userID)}
                className="inline-flex items-center rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Add Friend
              </button>
            )}
          </>
        )
      ) : (
        <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          {isHovered ? (
            <button
              onClick={() => cancelFriendRequestHandler(userID)}
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
    </div>
  );
};

export default FriendStatusButton;
