import { useState } from 'react';
import { useClearScheduleMutation } from '../../redux/services/schedule/scheduleService';
import { Modal } from 'flowbite-react';
import { Schedule as ScheduleType } from '../../types';
type Props = {
  scheduleId: string;
  currentSchedule: ScheduleType;
};

const ClearScheduleButton = ({ scheduleId, currentSchedule }: Props) => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [clearSchedule] = useClearScheduleMutation();

  const isScheduleEmpty = !currentSchedule || !currentSchedule.timeSlot || currentSchedule.timeSlot.length === 0;
  return (
    <>
      {currentSchedule && (
        <>
          <button
            onClick={() => setOpenModal(true)}
            disabled={isScheduleEmpty}
            type="button"
            className="mr-2 mb-2 rounded-lg border border-red-700 px-6 py-3.5 text-center text-sm font-medium uppercase text-red-700 hover:bg-red-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:disabled:border-slate-200 dark:disabled:bg-slate-50 dark:disabled:text-slate-500 disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900"
          >
            clear schedule
          </button>
          <Modal className="pt-20" show={openModal} onClose={() => setOpenModal(false)}>
            <Modal.Body className="py-20">
              <p className="text-center text-2xl dark:text-white">Are you sure you want to clear your schedule?</p>
              <div className="mt-5 flex justify-center">
                <button
                  onClick={() => {
                    clearSchedule({ scheduleId });
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
        </>
      )}
    </>
  );
};

export default ClearScheduleButton;
