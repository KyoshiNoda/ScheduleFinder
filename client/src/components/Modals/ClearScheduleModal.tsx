import { Dispatch, SetStateAction } from 'react';
import { ToastEnum } from '../../enums';
import { useToast } from '../../utils/functions';
import { Modal } from 'flowbite-react';
import { useClearScheduleMutation } from '../../redux/services/schedule/scheduleService';
import { useEscapeKey } from '../../utils/functions';

type Props = {
  scheduleId: string;
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
};

const ClearScheduleModal = ({ scheduleId, openModal, setOpenModal }: Props) => {
  const { showToast } = useToast();
  const [clearSchedule] = useClearScheduleMutation();
  useEscapeKey(() => setOpenModal(false));

  return (
    <Modal className="pt-20" show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Body className="py-20">
        <p className="text-center text-2xl dark:text-white">
          Are you sure you want to clear your schedule?
        </p>
        <div className="mt-5 flex justify-center">
          <button
            onClick={() => {
              clearSchedule({ scheduleId });
              showToast(ToastEnum.CLEAR_SCHEDULE);
              setOpenModal(false);
            }}
            type="button"
            className="mr-2 mb-2 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Yes
          </button>
          <button
            onClick={() => setOpenModal(false)}
            type="button"
            className="mr-2 mb-2 rounded-lg bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            Cancel
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ClearScheduleModal;
