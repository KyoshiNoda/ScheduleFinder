import { useState, useEffect } from 'react';
import TimeSlotInput from '../components/Schedule/TimeSlotInput';
import ScheduleBox from '../components/Schedule/ScheduleBox';
import Toggle from '../components/Toggle';
import Axios from 'axios';
import dayjs, { Dayjs } from 'dayjs/esm';
import customParseFormat from 'dayjs/esm/plugin/customParseFormat';
import localizedFormat from 'dayjs/esm/plugin/localizedFormat';
import 'dayjs/locale/en';
import { useSelector } from 'react-redux';
dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.locale('en');
type Props = {};

type days = {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
};

type TimeSlot = {
  _id: string;
  days: days;
  title: string;
  startTime: string;
  endTime: string;
  location: string | null;
  professor: string | null;
  color: string;
};

type Schedule = {
  _id: string;
  user_id: string;
  visibility: string;
  timeSlot: TimeSlot[];
};

function Schedule({}: Props) {
  const [schedules, setSchedules] = useState<[Schedule]>();
  const { userInfo,userToken } = useSelector((state: any) => state.auth);
  useEffect(() => {
    Axios.get('http://localhost:3001/api/schedules').then((res) => {
      setSchedules(res.data);
    });
  }, []);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    fetch(`http://localhost:3001/api/schedules/63f2dbdeef9b9d56ba5fc264`)
      .then((res) => res.json())
      .then((data) => setTimeSlots(data.timeSlot));
  }, []);

  return (
    <div className="flex h-[1110px] min-h-full flex-col gap-10 bg-slate-400 px-12 dark:bg-slate-900">
      <div className="flex justify-end">
        <Toggle />
      </div>
      <div className="flex gap-10">
        <ScheduleBox timeSlots={timeSlots} />
        <TimeSlotInput setTimeSlots={setTimeSlots} />
      </div>
    </div>
  );
}

export default Schedule;
