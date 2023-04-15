import ScheduleBox from '../components/Schedule/ScheduleBox';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useGetScheduleQuery } from '../redux/services/auth/authService';
import { Button } from 'flowbite-react';
import dayjs from 'dayjs';

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

  // This state represents the current time slots that are being displayed in the schedule box.
  const [timeSlots, setTimeSlots] = useState<TimeSlot[] | undefined>([]);

  // The first index of data represents scheduleA (the schedule of the user that is logged in).
  const { data, isFetching } = useGetScheduleQuery('schedule', {
    pollingInterval: 900000,
  });

  // This schedule is used to initialize the scheduleB state with an initial schedule and avoid
  // annoying errors about it potentially being undefined.
  const defaultSchedule = {
    _id: '',
    user_id: '',
    visibility: '',
    timeSlot: [],
  };

  // Schedule B is the schedule to compare against.
  const [scheduleB, setScheduleB] = useState<Schedule>(defaultSchedule);

  useEffect(() => {
    fetch(`http://localhost:3001/api/schedules/${userId}/user`)
      .then((res) => res.json())
      .then((data) => {
        setScheduleB(data[0]);
        setTimeSlots(data[0].timeSlot);
      })
      .catch((err) => console.log(err));
  }, []);

  const mergeSchedules = () => {
    const mergedSchedule = [...data[0].timeSlot, ...scheduleB.timeSlot];
    console.log(mergedSchedule);
    return mergedSchedule;
  };

  return (
    <div className="min-h-full bg-slate-400 p-6 dark:bg-slate-900">
      <div className="flex flex-col items-center gap-16">
        <Button.Group outline={true}>
          <Button
            onClick={() => setTimeSlots(scheduleB.timeSlot)}
            color="gray"
          >
            Other user schedule
          </Button>
          <Button onClick={() => setTimeSlots(data[0].timeSlot)} color="gray">
            My schedule
          </Button>
          <Button
            onClick={() => setTimeSlots(mergeSchedules)}
            color="gray"
          >
            Compare schedules
          </Button>
        </Button.Group>

        <div className="w-4/6">
          <ScheduleBox timeSlots={timeSlots} />
        </div>
      </div>
    </div>
  );
};

export default CompareSchedule;
