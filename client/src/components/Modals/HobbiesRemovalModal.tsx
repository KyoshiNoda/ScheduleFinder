import { Dispatch, SetStateAction } from 'react';
import { Modal } from 'flowbite-react';
import { ToastEnum } from '../../enums';
import { useToast } from '../../utils/functions';
import { useRemoveUserHobbyMutation } from '../../redux/services/hobbies/hobbyService';
import { useEscapeKey } from '../../utils/functions';

type Props = {
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  selectedHobby: string;
};

const HobbiesRemovalModal = ({ openModal, setOpenModal, selectedHobby }: Props) => {
  const { showToast } = useToast();
  const [removeHobby] = useRemoveUserHobbyMutation();

  const hobbyDeleteHandler = async () => {
    try {
      await removeHobby({ name: selectedHobby });
      setOpenModal(false);
      showToast(ToastEnum.REMOVE_HOBBY);
    } catch (error: any) {
      console.log(error);
    }
  };
  useEscapeKey(() => setOpenModal(false));

  return (
    <Modal show={openModal} size="lg" onClose={() => setOpenModal(false)} popup position="center">
      <Modal.Header />
      <Modal.Body>
        <div className="flex flex-col items-center justify-center gap-3">
          <p className="block text-base font-medium text-gray-900 dark:text-white">
            Remove {selectedHobby} from your hobbies?
          </p>
          <div className="flex justify-center gap-4">
            <button
              type="button"
              className="w-full rounded-full bg-blue-500 px-8 py-3 text-lg font-medium text-white dark:text-white"
              onClick={() => setOpenModal(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="w-full rounded-full bg-red-500 px-8 py-3 text-lg font-medium text-white hover:bg-red-700 dark:bg-rose-600 dark:text-white hover:dark:bg-rose-800"
              onClick={hobbyDeleteHandler}
            >
              Remove
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default HobbiesRemovalModal;
