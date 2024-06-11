import {
  useGetUserFriendsQuery,
  useDeleteFriendMutation,
} from '../redux/services/user/userService';
import { User as UserType } from '../types';
import { Link } from 'react-router-dom';
import { Avatar } from 'flowbite-react';
import { ToastEnum } from '../enums';
import Toast from '../components/Globals/Toast';
import { useToast } from '../utils/functions';
import { useAppSelector } from '../redux/store';
import { useState } from 'react';
import FriendRemovalModal from '../components/Modals/FriendRemovalModal';

const getFormattedFriendName = (friend: UserType) => {
  return `${friend.firstName} ${friend.lastName}`;
};

const Friends = () => {
  const { data: friends } = useGetUserFriendsQuery('User');
  const [deleteFriend] = useDeleteFriendMutation();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [friendToDelete, setFriendToDelete] = useState<UserType>();
  const { showToast } = useToast();
  const deleteFriendToast = useAppSelector((state: any) => state.globalSlice.toast);

  const onConfirmDeleteFriend = async () => {
    if (!friendToDelete) return;
    try {
      await deleteFriend({ friendID: friendToDelete._id });
      setOpenModal(false);
      showToast(ToastEnum.REMOVED_FRIEND);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-col gap-10 bg-gray-50 p-6 dark:bg-slate-900">
        <h1 className="text-center text-5xl font-medium dark:text-white">Friends</h1>
        <div className="flex justify-center overflow-x-auto md:px-20">
          <table className="w-full rounded-xl border bg-white dark:border-none dark:bg-gray-800 md:w-5/6 lg:w-1/2">
            <tbody>
              {friends &&
                friends.map((friend: UserType, index: number) => (
                  <tr
                    key={friend._id}
                    className={`flex w-full items-center justify-between ${
                      index != friends.length - 1 &&
                      'border-b border-solid border-gray-300 dark:border-gray-700'
                    } p-2 lg:p-4`}
                  >
                    <Link to={`/auth/user/${friend._id}`} className="mr-1 flex items-center gap-6">
                      <Avatar
                        img={friend.photoURL}
                        alt={`avatar of ${getFormattedFriendName(friend)}`}
                        rounded
                        size={'lg'}
                      />
                      <span className=" text-md dark:text-white lg:text-xl">
                        {getFormattedFriendName(friend)}
                      </span>
                    </Link>
                    <td className="flex items-center gap-3">
                      <Link
                        to={`/auth/compareSchedule/${friend._id}`}
                        className="rounded-lg bg-blue-700 p-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:p-3 lg:text-lg"
                      >
                        Schedule
                      </Link>
                      <button
                        onClick={() => {
                          setFriendToDelete(friend);
                          setOpenModal(true);
                        }}
                        className="rounded-lg bg-red-700 p-2 text-sm font-medium text-white  hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 sm:p-3 lg:text-lg"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {deleteFriendToast.state && <Toast message={deleteFriendToast.message} />}
      <FriendRemovalModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        onConfirmDeleteFriend={onConfirmDeleteFriend}
      />
    </>
  );
};

export default Friends;
