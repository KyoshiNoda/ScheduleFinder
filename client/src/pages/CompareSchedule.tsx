import ScheduleBox from '../components/Schedule/ScheduleBox';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

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

const CompareSchedule = () => {
  const { userId } = useParams();
  // Schedule B is the schedule that the user will compare their schedule against. 
  const [scheduleB, setScheduleB] = useState<Schedule>();

  return (
    <div className="flex min-h-full flex-col items-center space-y-10 bg-slate-400 p-6 dark:bg-slate-900">
      {/* <ScheduleBox /> */}
      <h1>{userId}</h1>
    </div>
  );
};

export default CompareSchedule;
