import TimeSlotInput from '../components/Calendar/TimeSlotInput';
import ScheduleBox from '../components/Calendar/ScheduleBox';
import Toast from '../components/Globals/Toast';
import { useAppDispatch } from '../redux/store';
import { toggleReadOnly } from '../redux/feats/globalSlice/globalSlice';
import { useAppSelector } from '../redux/store';
const SchedulePage = () => {
  const dispatch = useAppDispatch();
  const scheduleToast = useAppSelector((state: any) => state.globalSlice.toast);
  dispatch(toggleReadOnly(false));


  return (
    <div className="flex min-h-full flex-col gap-10 bg-gray-50 py-5 px-8 dark:bg-slate-900 2xl:px-12">
      <div className="flex flex-col lg:flex-row lg:gap-4 2xl:gap-10 mt-16">
        <ScheduleBox timeSlots={undefined} />
        <TimeSlotInput />
      </div>
      {scheduleToast.state && <Toast message={scheduleToast.message} />}
    </div>
  );
};

export default SchedulePage;