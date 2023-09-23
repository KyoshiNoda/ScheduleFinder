import { useState, useEffect } from 'react';
import { useGetUserFriendsQuery, useDeleteFriendMutation } from '../redux/services/user/userService';
import { User as UserType } from '../types';
import { Button, Modal, Spinner } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Table } from 'flowbite-react';

const Friends = () => {
  const { data, isLoading } = useGetUserFriendsQuery('User');
  const [friends, setFriends] = useState<UserType[]>();
  const [deleteFriend] = useDeleteFriendMutation();
  const [openModal, setOpenModal] = useState<string | undefined>();
  const [tempFriend, setTempFriend] = useState<string>('');

  useEffect(() => {
    if (data && !isLoading) {
      setFriends(data);
    }
  }, [data, isLoading]);

  const onConfirmFriendDeleted = async () => {
    try {
      await deleteFriend({ friendID: tempFriend });
      setOpenModal(undefined);
    } catch (error: any) {
      console.log(error);
    }
  };

  const tempFriendHandler = (id: string) => {
    setTempFriend(id);
    setOpenModal('pop-up');
  };

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 bg-slate-400 dark:bg-slate-900 dark:text-white">
      <>
        <Modal show={openModal === 'pop-up'} size="md" popup onClose={() => setOpenModal(undefined)} className="mt-52">
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to remove this person?</h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={() => onConfirmFriendDeleted()}>
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

      <h1 className="text-6xl">Friends</h1>
            
      <Table striped>
        <Table.Body>
          {friends ? (
            friends.map((friend) => (
              <Table.Row key={friend._id}>
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <img
                      alt={`${friend.firstName} ${friend.lastName}'s photo`}
                      className="h-24 w-24 rounded-full border dark:border-gray-700 dark:bg-gray-500"
                      src={friend.photoURL}
                    />
                    <div>
                      <span className="block text-xl text-black dark:text-white">
                        {friend.firstName} {friend.lastName}
                      </span>
                      <span className="block text-base">{friend.school}</span>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <button
                    type="button"
                    className="rounded-lg bg-red-700 px-3 py-3 font-semibold text-white hover:bg-red-500 hover:dark:bg-red-500"
                    onClick={() => tempFriendHandler(friend._id)}
                  >
                    Remove
                  </button>
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Spinner aria-label="Friends loading spinner" size="xl" className='mt-10' />
            )}
        </Table.Body>
      </Table>
    </div>
  );
};

export default Friends;
