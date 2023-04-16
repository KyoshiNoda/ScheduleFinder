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

  const mergeTimeSlots = () => {
    let timeSlotsA: any = [];
    if (data[0].timeSlot.length > 0) {
      timeSlotsA = data[0].timeSlot.map((timeSlot: TimeSlot) => {
        return { ...timeSlot, color: 'red' };
      });
    }

    let timeSlotsB: any = [];
    if (scheduleB.timeSlot.length > 0) {
      timeSlotsB = scheduleB.timeSlot.map((timeSlot: TimeSlot) => {
        return { ...timeSlot, color: 'blue' };
      });
    }

    const mergedTimeSlots: TimeSlot[] = [...timeSlotsA, ...timeSlotsB];
    return mergedTimeSlots;
  };

  // This function is used to sort the time slots in the findIntervalsFunction by their startTime.
  const compareTimeSlots = (a: TimeSlot, b: TimeSlot) => {
    if (
      new Date(`January 1, 1970 ${a.startTime}`) <
      new Date(`January 1, 1970 ${b.startTime}`)
    ) {
      return -1;
    }
    if (
      new Date(`January 1, 1970 ${a.startTime}`) >
      new Date(`January 1, 1970 ${b.startTime}`)
    ) {
      return 1;
    }
    return 0;
  };

  const findFreeIntervals = (timeSlots: TimeSlot[], day: string) => {
    timeSlots.sort(compareTimeSlots);
    console.log(timeSlots);
    if (timeSlots.length < 2) return timeSlots;

    const free: TimeSlot[] = [];
    let combined: TimeSlot[] = [...timeSlots];
    for (let i = 0; i < timeSlots.length; i++) {
      const newCombined = [];
      for (let j = 0; j + 1 < combined.length; j++) {
        // Check if current time slot is inside the previous one
        if (
          j > 0 &&
          new Date(`January 1, 1970 ${combined[j - 1].startTime}`) <
            new Date(`January 1, 1970 ${combined[j].startTime}`) &&
          new Date(`January 1, 1970 ${combined[j - 1].endTime}`) >
            new Date(`January 1, 1970 ${combined[j].endTime}`)
        ) {
          if (j + 1 < combined.length && j + 2 === combined.length) {
            newCombined.push(combined[j + 1]);
          }
          continue;
        }
        if (
          new Date(`January 1, 1970 ${combined[j].startTime}`) <=
            new Date(`January 1, 1970 ${combined[j + 1].startTime}`) &&
          new Date(`January 1, 1970 ${combined[j].endTime}`) <=
            new Date(`January 1, 1970 ${combined[j + 1].startTime}`)
        ) {
          newCombined.push(combined[j]);
          if (j + 2 === combined.length) {
            newCombined.push(combined[j + 1]);
          }
        } else {
          if (
            new Date(`January 1, 1970 ${combined[j].endTime}`) >
            new Date(`January 1, 1970 ${combined[j + 1].endTime}`)
          ) {
            newCombined.push({
              ...combined[j],
              startTime: combined[j].startTime,
              endTime: combined[j].endTime,
            });
          } else {
            newCombined.push({
              ...combined[j],
              startTime: combined[j].startTime,
              endTime: combined[j + 1].endTime,
            });
          }
        }
      }
      if (i < timeSlots.length - 1) {
        combined = [...newCombined];
      }
    }

    // Now that the overlaping time slots have been combined,
    // we can get the free time slots easier

    if (
      new Date(`January 1, 1970 ${`7:00 AM`}`) <
      new Date(`January 1, 1970 ${combined[0].startTime}`)
    ) {
      free.push({
        ...combined[0],
        startTime: '7:00 AM',
        endTime: combined[0].startTime,
      });
    }

    for (let i = 0; i + 1 < combined.length; i++) {
      if (combined[i].endTime < combined[i + 1].startTime) {
        free.push({
          ...combined[i],
          startTime: combined[i].endTime,
          endTime: combined[i + 1].startTime,
        });
      }
    }

    if (
      new Date(`January 1, 1970 ${`8:00 PM`}`) >
      new Date(`January 1, 1970 ${combined[combined.length - 1].endTime}`)
    ) {
      free.push({
        ...combined[combined.length - 1],
        startTime: combined[combined.length - 1].endTime,
        endTime: '9:00 PM',
      });
    }

    const freeTimeSlots: any = free.map((timeSlot) => {
      return {
        ...timeSlot,
        color: 'green',
        location: '',
        professor: null,
        title: 'Free Time',
        days: {
          monday: day === 'monday' ? true : false,
          tuesday: day === 'tuesday' ? true : false,
          wednesday: day === 'wednesday' ? true : false,
          thursday: day === 'thursday' ? true : false,
          friday: day === 'friday' ? true : false,
        },
      };
    });
    return freeTimeSlots;
  };

  const getFreeTimeSlots = () => {
    const mergedTimeSlots: TimeSlot[] = mergeTimeSlots();

    const mondayFreeTimes = findFreeIntervals(
      mergedTimeSlots.filter((timeSlot) => timeSlot.days.monday),
      'monday'
    );

    const tuesdayFreeTimes = findFreeIntervals(
      mergedTimeSlots.filter((timeSlot) => timeSlot.days.tuesday),
      'tuesday'
    );

    const wednesdayFreeTimes = findFreeIntervals(
      mergedTimeSlots.filter((timeSlot) => timeSlot.days.wednesday),
      'wednesday'
    );

    const thursdayFreeTimes = findFreeIntervals(
      mergedTimeSlots.filter((timeSlot) => timeSlot.days.thursday),
      'thursday'
    );

    const fridayFreeTimes = findFreeIntervals(
      mergedTimeSlots.filter((timeSlot) => timeSlot.days.friday),
      'friday'
    );

    return [
      ...mondayFreeTimes,
      ...tuesdayFreeTimes,
      ...wednesdayFreeTimes,
      ...thursdayFreeTimes,
      ...fridayFreeTimes,
    ];
  };

  return (
    <div className="min-h-full bg-slate-400 p-6 dark:bg-slate-900">
      <div className="flex flex-col items-center gap-16">
        <Button.Group outline={true}>
          <Button onClick={() => setTimeSlots(scheduleB.timeSlot)} color="gray">
            Other user schedule
          </Button>
          <Button onClick={() => setTimeSlots(data[0].timeSlot)} color="gray">
            My schedule
          </Button>
          <Button onClick={() => setTimeSlots(getFreeTimeSlots)} color="gray">
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
