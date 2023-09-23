import TimeSlotInput from '../components/Schedule/TimeSlotInput';
import ScheduleBox from '../components/Schedule/ScheduleBox';
import { useAppDispatch } from '../redux/store';
import { toggleReadOnly } from '../redux/feats/globalSlice/globalSlice';
import { useGetScheduleQuery } from '../redux/services/auth/authService';

const Schedule = () => {
  const { data, isFetching } = useGetScheduleQuery('schedule', {
    pollingInterval: 900000,
  });

  const dispatch = useAppDispatch();
  dispatch(toggleReadOnly(false));

  return (
    <div className="flex min-h-full flex-col gap-10 bg-slate-400 py-5 px-8 dark:bg-slate-900 2xl:px-12">
      <div className="flex flex-col lg:flex-row lg:gap-4 2xl:gap-10">
        {!isFetching && <ScheduleBox timeSlots={data.timeSlots} />}
        <TimeSlotInput />
      </div>
    </div>
  );
};

export default Schedule;
