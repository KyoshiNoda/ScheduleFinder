import { useEffect } from 'react';
import Toast from '../components/Globals/Toast';
import CalendarViewParent from '../components/Calendar/CalendarViewParent';
import { useAppDispatch } from '../redux/store';
import { toggleReadOnly } from '../redux/feats/globalSlice/globalSlice';
import { useAppSelector } from '../redux/store';

const SchedulePage = () => {
  const dispatch = useAppDispatch();
  const scheduleToast = useAppSelector((state: any) => state.globalSlice.toast);

  useEffect(() => {
    dispatch(toggleReadOnly(false));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 px-5 py-5 dark:bg-slate-900 dark:text-white xl:px-8 2xl:px-12">
      <div className="mt-16">
        <CalendarViewParent />
      </div>
      {scheduleToast.state && <Toast message={scheduleToast.message} />}
    </div>
  );
};

export default SchedulePage;
