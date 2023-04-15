import ScheduleBox from '../components/Schedule/ScheduleBox';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useGetScheduleQuery } from '../redux/services/auth/authService';
import { Button } from 'flowbite-react';

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

  const { data, isFetching } = useGetScheduleQuery('schedule', {
    pollingInterval: 900000,
  });
  // Schedule A is the schedule of the user that is signed in.
  const [scheduleA] = data;

  // Schedule B is the schedule to compare against.
  const [scheduleB, setScheduleB] = useState<Schedule>();

  useEffect(() => {
    fetch(`http://localhost:3001/api/schedules/${userId}/user`)
      .then((res) => res.json())
      .then((data) => {
        const [schedule] = data;
        setScheduleB(schedule);
        setTimeSlots(scheduleB?.timeSlot);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="min-h-full bg-slate-400 p-6 dark:bg-slate-900">
      <div className="flex flex-col items-center gap-16">
        <Button.Group outline={true}>
          <Button
            onClick={() => setTimeSlots(scheduleB?.timeSlot)}
            color="gray"
          >
            Other user schedule
          </Button>
          <Button onClick={() => setTimeSlots(scheduleA.timeSlot)} color="gray">
            My schedule
          </Button>
          <Button
            onClick={() =>
              setTimeSlots([...scheduleA.timeSlot].concat(scheduleB?.timeSlot))
            }
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
