import { useState } from 'react';
import { Schedule as ScheduleType } from '../../types';
import ClearScheduleModal from '../Modals/ClearScheduleModal';
import { cn } from '../../utils/functions';

type Props = {
  scheduleId?: string;
  currentSchedule?: ScheduleType | null;
  className?: string;
};

const ClearScheduleButton = ({ scheduleId = '', currentSchedule, className }: Props) => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const isScheduleEmpty =
    !scheduleId ||
    !currentSchedule ||
    !currentSchedule.timeSlots ||
    currentSchedule.timeSlots.length === 0;

  return (
    <>
      <button
        onClick={() => setOpenModal(true)}
        disabled={isScheduleEmpty}
        type="button"
        className={cn(
          'rounded-lg border border-red-700 px-2 py-3 text-center text-sm font-medium uppercase text-red-700 transition-colors hover:bg-red-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900 dark:disabled:border-slate-700 dark:disabled:bg-slate-800 dark:disabled:text-slate-500',
          className
        )}
      >
        Clear schedule
      </button>
      {scheduleId && (
        <ClearScheduleModal
          scheduleId={scheduleId}
          openModal={openModal}
          setOpenModal={setOpenModal}
        />
      )}
    </>
  );
};

export default ClearScheduleButton;
