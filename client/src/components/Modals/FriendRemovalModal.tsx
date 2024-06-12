import { Modal, Button } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Dispatch, SetStateAction } from 'react';

type FriendRemovalModalProps = {
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  onConfirmDeleteFriend: () => void;
};

const FriendRemovalModal = ({
  openModal,
  setOpenModal,
  onConfirmDeleteFriend,
}: FriendRemovalModalProps) => {
  return (
    <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)} className="pt-60">
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            Are you sure you want to remove this person?
          </h3>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={onConfirmDeleteFriend}>
              Yes, I'm sure
            </Button>
            <Button color="gray" onClick={() => setOpenModal(false)}>
              No, cancel
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default FriendRemovalModal;
