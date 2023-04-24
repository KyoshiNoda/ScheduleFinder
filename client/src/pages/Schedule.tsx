import { useState, useEffect } from 'react';
import TimeSlotInput from '../components/Schedule/TimeSlotInput';
import ScheduleBox from '../components/Schedule/ScheduleBox';
import Toggle from '../components/Toggle';
import { useGetScheduleQuery } from '../redux/services/auth/authService';
import { Schedule as ScheduleType } from '../types';
import { TimeSlot as TimeSlotType } from '../types';
type Props = {};

function Schedule({}: Props) {
  const { data, isFetching } = useGetScheduleQuery('schedule', {
    pollingInterval: 900000,
  });
  
  const [schedule, setSchedule] = useState<ScheduleType>();
  const [timeSlots, setTimeSlots] = useState<TimeSlotType[]>([]);
  useEffect(() => {
    if (!isFetching && data) {
      setSchedule(data[0]);
      setTimeSlots((prevTimeSlots) => [
        ...prevTimeSlots,
        ...(schedule?.timeSlot || []),
      ]);
    }
  }, [data, isFetching, schedule]);

  return (
    <div className="flex h-[1110px] min-h-full flex-col gap-10 bg-slate-400 px-8 2xl:px-12 dark:bg-slate-900">
      <div className="flex justify-end">
        <Toggle />
      </div>
      <div className="flex gap-4 2xl:gap-10">
        <ScheduleBox timeSlots={timeSlots} />
        <TimeSlotInput setTimeSlots={setTimeSlots} />
      </div>
    </div>
  );
}

export default Schedule;
