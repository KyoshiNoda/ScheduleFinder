import TimeSlotInput from '../components/Schedule/TimeSlotInput';
import ScheduleBox from '../components/Schedule/ScheduleBox';
import Toggle from '../components/Toggle';
import { useAppDispatch } from '../redux/store';
import { toggleReadOnly } from '../redux/feats/globalSlice/globalSlice';

type Props = {};

function Schedule({}: Props) {
  const dispatch = useAppDispatch();
  dispatch(toggleReadOnly(false));

  return (
    <div className="flex min-h-full flex-col gap-10 bg-slate-400 py-5 px-8 dark:bg-slate-900 2xl:px-12">
      <div className="flex justify-end">
        <Toggle />
      </div>
      <div className="flex flex-col lg:flex-row lg:gap-4 2xl:gap-10">
        <ScheduleBox timeSlots={undefined} />
        <TimeSlotInput />
      </div>
    </div>
  );
}

export default Schedule;
