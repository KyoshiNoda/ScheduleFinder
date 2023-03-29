import { useState, useEffect } from 'react';
import TimeBlockInput from '../components/Schedule/TimeBlockInput';
import ScheduleBox from '../components/Schedule/ScheduleBox';
import Toggle from '../components/Toggle';
import Axios from 'axios';
import dayjs, { Dayjs } from 'dayjs/esm';
import customParseFormat from 'dayjs/esm/plugin/customParseFormat';
import localizedFormat from 'dayjs/esm/plugin/localizedFormat';
import 'dayjs/locale/en';
dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.locale('en');

type Props = {};
type TimeSlot = {
  day: string;
  category: string;
  title: string;
  startTime: string;
  endTime: string;
  color: string;
  location?: string;
  professor?: string;
};
type Schedule = {
  _id: string;
  user_id: string;
  visibility: string;
  timeSlot: TimeSlot[];
};
type TimeSection = {
  startTime: Dayjs;
  endTime: Dayjs;
};
function Schedule({}: Props) {
  const [schedules, setSchedules] = useState<[Schedule]>();
  useEffect(() => {
    Axios.get('http://localhost:3001/api/schedules').then((res) => {
      setSchedules(res.data);
    });
  }, []);
  const timeSlot: TimeSlot | undefined = schedules?.[0].timeSlot[0]; // a single timeSlot from DB

  const time1: TimeSection = {
    //
    startTime: dayjs(timeSlot?.startTime, 'h:mm A'), // 2023-03-21T10:25:00-04:00
    endTime: dayjs(timeSlot?.endTime, 'h:mm A'), // 2023-03-21T12:30:00-04:00
  };
  const time2: TimeSection = {
    startTime: dayjs('10:25 AM', 'h:mm A'),
    endTime: dayjs('12:30 PM', 'h:mm A'),
  };

  let result: string = time1.startTime.isSame(time2.startTime)
    ? 'its the same'
    : 'not same'; // checks if start or end time are the same
  console.log(result);

  const totalTime: number = time1.endTime.diff(time1.startTime, 'hours'); // total time from timeSlot
  console.log(totalTime);
  return (
    <div className="flex min-h-full flex-col gap-10 bg-slate-400 p-5 dark:bg-slate-900">
      <div className="flex justify-end">
        <Toggle />
      </div>
      <div className="flex h-screen gap-12">
        <ScheduleBox />
        <TimeBlockInput />
      </div>
    </div>
  );
}

export default Schedule;
