import { useGetUserFriendsQuery, useDeleteFriendMutation } from '../redux/services/user/userService';
import { User, User as UserType } from '../types';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Avatar, Modal, Button } from 'flowbite-react';
import { useState } from 'react';

const getFormattedFriendName = (friend: UserType) => {
  return `${friend.firstName} ${friend.lastName}`;
};

const Friends = () => {
  const { data: friends, isLoading } = useGetUserFriendsQuery('User');
  const [deleteFriend] = useDeleteFriendMutation();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [friendToDelete, setFriendToDelete] = useState<UserType>();
  console.log('LOG:', friends);

  const onConfirmDeleteFriend = async () => {
    if (!friendToDelete) return;
    try {
      await deleteFriend({ friendID: friendToDelete._id });
      setOpenModal(false);
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
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to remove this person?
            </h3>
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

      <div className="min-h-full bg-slate-400 p-6 dark:bg-slate-900">
        <h1>Friends Page</h1>

        <div className="overflow-x-auto">
          <table>
            <tbody>
              {friends &&
                friends.map((friend: UserType) => (
                  <tr key={friend._id}>
                    <td>
                      <Avatar img={friend.photoURL} alt={`avatar of ${getFormattedFriendName(friend)}`} rounded />
                      <span>{getFormattedFriendName(friend)}</span>
                    </td>
                    <td>
                      {/* TODO: Add link to the user profile page */}
                      <Link
                        to={'#'}
                        className="me-2 mb-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        View Profile
                      </Link>
                      <button
                        onClick={() => {
                          setFriendToDelete(friend);
                          setOpenModal(true);
                        }}
                        className="me-2 mb-2 rounded-lg bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
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
    </>
  );
};

export default Friends;
