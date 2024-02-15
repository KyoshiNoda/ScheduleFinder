import { useState } from 'react';
import { useToast } from '../../utils/functions';
import { ToastEnum } from '../../enums';
import { Button } from 'flowbite-react';
import { BiTime } from 'react-icons/bi'
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
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
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
          <Button onClick={() => acceptFriendRequestHandler(userID)} color="green">
            Accept Friend Request
          </Button>
        ) : (
          <>
            {!isFriends && (
              <Button onClick={() => sendFriendRequestHandler(userID)} color="blue">
                Add Friend
              </Button>
            )}
          </>
        )
      ) : (
        <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          {isHovered ? (
            <Button onClick={() => cancelFriendRequestHandler(userID)} color="red">
              Cancel Request
            </Button>
          ) : (
            <span className="flex items-center gap-1 rounded border px-4 py-2 dark:text-gray-500">
              Pending <BiTime size="20" />
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default FriendStatusButton;
