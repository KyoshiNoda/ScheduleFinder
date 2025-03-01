import { useState } from 'react';
import { Schedule as ScheduleType } from '../../types';
import ClearScheduleModal from '../Modals/ClearScheduleModal';

type Props = {
  scheduleId: string;
  currentSchedule: ScheduleType;
};

const ClearScheduleButton = ({ scheduleId, currentSchedule }: Props) => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const isScheduleEmpty =
    !currentSchedule || !currentSchedule.timeSlots || currentSchedule.timeSlots.length === 0;

  return (
    <>
      {currentSchedule && (
        <>
          <button
            onClick={() => setOpenModal(true)}
            disabled={isScheduleEmpty}
            type="button"
            className="mr-2 mb-2 rounded-lg border border-red-700 px-6 py-3.5 text-center text-sm font-medium uppercase text-red-700 hover:bg-red-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900 dark:disabled:border-slate-200 dark:disabled:bg-slate-50 dark:disabled:text-slate-500"
          >
            clear schedule
          </button>
          <ClearScheduleModal
            scheduleId={scheduleId}
            openModal={openModal}
            setOpenModal={setOpenModal}
          />
        </>
      )}
    </>
  );
};

export default ClearScheduleButton;
