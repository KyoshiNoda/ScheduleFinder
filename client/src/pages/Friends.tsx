import { useGetUserFriendsQuery, useDeleteFriendMutation } from '../redux/services/user/userService';
import { User as UserType } from '../types';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Avatar, Modal, Button } from 'flowbite-react';
import { ToastEnum } from '../enums';
import Toast from '../components/Utils/Toast';
import { useToast } from '../utils/functions';
import { useAppSelector } from '../redux/store';
import { useState } from 'react';

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
      <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)} className="pt-60">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to remove this person?</h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => onConfirmDeleteFriend()}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <div className="flex min-h-full flex-col gap-10 bg-slate-400 p-6 dark:bg-slate-900">
        <h1 className="text-center text-5xl font-medium dark:text-white">Friends</h1>

        <div className="overflow-x-auto px-5 md:px-20 flex justify-center">
          <table className="w-full md:w-5/6 lg:w-1/2 rounded-xl bg-white dark:bg-gray-800">
            <tbody>
              {friends &&
                friends.map((friend: UserType, index: number) => (
                  <tr
                    key={friend._id}
                    className={`flex w-full items-center justify-between ${
                      index != friends.length - 1 && 'border-b border-solid border-gray-300 dark:border-gray-700'
                    } lg:p-4 p-2`}
                  >
                    <td className="flex items-center gap-6">
                      <Avatar img={friend.photoURL} alt={`avatar of ${getFormattedFriendName(friend)}`} rounded size={'lg'} />
                      <span className=" text-md lg:text-xl dark:text-white">{getFormattedFriendName(friend)}</span>
                    </td>
                    <td className="flex items-center gap-3">
                      <Link
                        to={`/auth/user/${friend._id}`}
                        className="rounded-lg bg-blue-700 text-sm p-1 sm:p-3 text-center font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        View Profile
                      </Link>
                      <button
                        onClick={() => {
                          setFriendToDelete(friend);
                          setOpenModal(true);
                        }}
                        className="rounded-lg bg-red-700 text-sm p-1 sm:p-3  font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                      >
                        Delete Friend
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {deleteFriendToast.state && <Toast message={deleteFriendToast.message} />}
    </>
  );
};

export default Friends;
