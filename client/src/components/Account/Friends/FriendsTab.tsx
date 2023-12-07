import { useState, useEffect } from 'react';
import {
  useGetUserFriendsQuery,
  useDeleteFriendMutation,
} from '../../../redux/services/user/userService';
import { User as UserType } from '../../../types';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Spinner } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useToast } from '../../../utils/functions';
const FriendsTab = () => {
  const { showToast } = useToast();
  const { data, isLoading } = useGetUserFriendsQuery('User');
  const [friends, setFriends] = useState<UserType[]>();
  const [deleteFriend] = useDeleteFriendMutation();
  const [openModal, setOpenModal] = useState<string | undefined>();
  const [tempFriend, setTempFriend] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    if (data && !isLoading) {
      setFriends(data);
    }
  }, [data, isLoading]);
  const onFriendClicked = (id: string) => {
    navigate(`/auth/compareSchedule/${id}`);
  };
  const onConfirmFriendDeleted = async () => {
    try {
      await deleteFriend({ friendID: tempFriend });
      setOpenModal(undefined);
      showToast("Removed Friend!");
    } catch (error: any) {
      console.log(error);
    }
  };
  const tempFriendHandler = (id: string) => {
    setTempFriend(id);
    setOpenModal('pop-up');
  };
  return (
    <div className="flex flex-col items-center justify-center gap-6 rounded dark:text-white">
      <>
        <Modal
          show={openModal === 'pop-up'}
          size="md"
          popup
          onClose={() => setOpenModal(undefined)}
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to remove this person?
              </h3>
              <div className="flex justify-center gap-4">
                <Button
                  color="failure"
                  onClick={() => onConfirmFriendDeleted()}
                >
                  Yes, I'm sure
                </Button>
                <Button color="gray" onClick={() => setOpenModal(undefined)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </>

      {friends ? (
        friends.map((friend) => {
          return (
            <div key={friend._id} className="flex w-full gap-10">
              <div
                className="flex w-full cursor-pointer gap-4"
                onClick={() => onFriendClicked(friend._id)}
              >
                <img
                  alt=""
                  className="h-24 w-24 rounded-full border dark:border-gray-700 dark:bg-gray-500"
                  src={friend.photoURL}
                />
                <div className="flex flex-col justify-center">
                  <div className="flex text-xl">
                    {friend.firstName} {friend.lastName}
                  </div>
                  <div className="text-blue-700 dark:text-gray-400">
                    {friend.school}
                  </div>
                </div>
              </div>
              <div className="ml-auto flex items-center">
                <button
                  type="button"
                  className="rounded-lg bg-red-500 hover:bg-red-700 hover:dark:bg-red-700 px-3 py-3 font-semibold text-white"
                  onClick={() => tempFriendHandler(friend._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <Spinner aria-label="Friends loading spinner" size="xl" />
      )}
    </div>
  );
};

export default FriendsTab;
