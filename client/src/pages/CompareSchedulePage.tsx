import ScheduleBox from '../components/Schedule/ScheduleBox';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useGetScheduleQuery } from '../redux/services/schedule/scheduleService';
import { Button } from 'flowbite-react';
import { useAppDispatch } from '../redux/store';
import { toggleReadOnly } from '../redux/feats/globalSlice/globalSlice';
import { getApiUrl } from '../utils/environment';
import { TimeSlot as TimeSlotType, Schedule as ScheduleType } from '../types';

let BASE_URL = getApiUrl();

const CompareSchedulePage = () => {
  const { userId } = useParams();
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    dispatch(toggleReadOnly(true));
  }, [dispatch]);

  const [showOtherSchedule, setShowOtherSchedule] = useState<boolean>(true);
  const [showUserSchedule, setShowUserSchedule] = useState<boolean>(false);
  const [showCompareSchedule, setShowCompareSchedule] = useState<boolean>(false);

  const [displayUserSlots, setDisplayUserSlots] = useState<boolean>(true);
  const [displayOtherSlots, setDisplayOtherSlots] = useState<boolean>(true);
  const [displayFreeSlots, setDisplayFreeSlots] = useState<boolean>(true);

  const [timeSlots, setTimeSlots] = useState<TimeSlotType[] | undefined>([]);

  const { data, isFetching } = useGetScheduleQuery('schedule', {
    pollingInterval: 900000,
  });

  const defaultSchedule = {
    _id: '',
    user_id: '',
    visibility: '',
    timeSlots: [],
  };

  const [scheduleB, setScheduleB] = useState<ScheduleType>(defaultSchedule);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    fetch(`${BASE_URL}api/schedules/${userId}/user`)
      .then((res) => res.json())
      .then((data) => {
        setScheduleB(data);
        setTimeSlots(data.timeSlots);
      })
      .catch((err) => console.log(err));

    fetch(`${BASE_URL}api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => setUserName(data.firstName))
      .catch((err) => console.log(err));
  }, [userId]);

  // Convert time string to minutes since midnight for easier comparison
  const timeToMinutes = (time: string): number => {
    const date = new Date(`January 1, 1970 ${time}`);
    return date.getHours() * 60 + date.getMinutes();
  };

  // Convert minutes back to time string
  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
  };

  const mergeTimeSlots = () => {
    if (!data?.timeSlots) return [];
    
    const timeSlotsA = data.timeSlots.map((timeSlot: TimeSlotType) => ({
      ...timeSlot,
      color: 'red',
      _id: crypto.randomUUID(),
    }));
    
    const timeSlotsB = scheduleB.timeSlots.map((timeSlot: TimeSlotType) => ({
      ...timeSlot,
      color: 'blue',
      _id: crypto.randomUUID(),
    }));

    return [...timeSlotsA, ...timeSlotsB];
  };

  // Merge overlapping intervals using the classic algorithm
  const mergeIntervals = (intervals: Array<{ start: number; end: number }>) => {
    if (intervals.length === 0) return [];

    // Sort by start time
    intervals.sort((a, b) => a.start - b.start);

    const merged = [intervals[0]];

    for (let i = 1; i < intervals.length; i++) {
      const current = intervals[i];
      const lastMerged = merged[merged.length - 1];

      if (current.start <= lastMerged.end) {
        // Overlapping intervals, merge them
        lastMerged.end = Math.max(lastMerged.end, current.end);
      } else {
        // Non-overlapping, add as new interval
        merged.push(current);
      }
    }

    return merged;
  };

  const findFreeIntervals = (timeSlots: TimeSlotType[]) => {
    if (timeSlots.length === 0) {
      // If no busy slots, entire day is free
      return [{
        start: timeToMinutes('7:00 AM'),
        end: timeToMinutes('9:00 PM'),
      }];
    }

    // Convert to minutes and merge
    const busyIntervals = timeSlots.map(slot => ({
      start: timeToMinutes(slot.startTime),
      end: timeToMinutes(slot.endTime),
    }));

    const mergedBusy = mergeIntervals(busyIntervals);

    // Find free time gaps
    const freeIntervals = [];
    const dayStart = timeToMinutes('7:00 AM');
    const dayEnd = timeToMinutes('9:00 PM');

    // Check if there's free time before first busy slot
    if (mergedBusy[0].start > dayStart) {
      freeIntervals.push({
        start: dayStart,
        end: mergedBusy[0].start,
      });
    }

    // Check gaps between busy slots
    for (let i = 0; i < mergedBusy.length - 1; i++) {
      if (mergedBusy[i].end < mergedBusy[i + 1].start) {
        freeIntervals.push({
          start: mergedBusy[i].end,
          end: mergedBusy[i + 1].start,
        });
      }
    }

    // Check if there's free time after last busy slot
    const lastBusy = mergedBusy[mergedBusy.length - 1];
    if (lastBusy.end < dayEnd) {
      freeIntervals.push({
        start: lastBusy.end,
        end: dayEnd,
      });
    }

    return freeIntervals;
  };

  const getFreeTimeSlots = () => {
    const mergedTimeSlots = mergeTimeSlots();
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const;
    
    const allFreeSlots: TimeSlotType[] = [];

    days.forEach(day => {
      const daySlots = mergedTimeSlots.filter(slot => slot.days[day]);
      const freeIntervals = findFreeIntervals(daySlots);

      freeIntervals.forEach(interval => {
        allFreeSlots.push({
          _id: crypto.randomUUID(),
          startTime: minutesToTime(interval.start),
          endTime: minutesToTime(interval.end),
          color: 'green',
          location: '',
          professor: null,
          title: 'Free Time',
          days: {
            monday: day === 'monday',
            tuesday: day === 'tuesday',
            wednesday: day === 'wednesday',
            thursday: day === 'thursday',
            friday: day === 'friday',
          },
        } as TimeSlotType);
      });
    });

    return allFreeSlots;
  };

  const combineFreeAndMergedTimeSlots = (
    isChecked1 = true,
    isChecked2 = true,
    isChecked3 = true
  ) => {
    const mergedTimeSlots = mergeTimeSlots();
    const userTimeSlots = mergedTimeSlots.filter(slot => slot.color === 'red');
    const otherTimeSlots = mergedTimeSlots.filter(slot => slot.color === 'blue');

    const timeSlotsToDisplay = [];
    if (isChecked1) timeSlotsToDisplay.push(...userTimeSlots);
    if (isChecked2) timeSlotsToDisplay.push(...otherTimeSlots);
    if (isChecked3) timeSlotsToDisplay.push(...getFreeTimeSlots());

    return timeSlotsToDisplay;
  };

  const handleViewChange = (view: 'other' | 'user' | 'compare') => {
    setDisplayUserSlots(true);
    setDisplayOtherSlots(true);
    setDisplayFreeSlots(true);

    switch (view) {
      case 'other':
        setTimeSlots(scheduleB.timeSlots);
        setShowOtherSchedule(true);
        setShowUserSchedule(false);
        setShowCompareSchedule(false);
        break;
      case 'user':
        setTimeSlots(data?.timeSlots);
        setShowOtherSchedule(false);
        setShowUserSchedule(true);
        setShowCompareSchedule(false);
        break;
      case 'compare':
        setTimeSlots(combineFreeAndMergedTimeSlots());
        setShowOtherSchedule(false);
        setShowUserSchedule(false);
        setShowCompareSchedule(true);
        break;
    }
  };

  return (
    <div className="min-h-full bg-gray-50 p-6 dark:bg-slate-900">
      <div className="mt-5 flex flex-col items-center gap-16">
        <Button.Group outline={true}>
          <Button onClick={() => handleViewChange('other')} color="gray">
            {`${userName}'s`} schedule
          </Button>
          <Button onClick={() => handleViewChange('user')} color="gray">
            My schedule
          </Button>
          <Button onClick={() => handleViewChange('compare')} color="gray">
            Compare schedules
          </Button>
        </Button.Group>

        {showOtherSchedule && (
          <h1 className="text-center text-4xl dark:text-white">
            {`${userName}'s Schedule`}
          </h1>
        )}
        {showUserSchedule && (
          <h1 className="text-4xl dark:text-white">My Schedule</h1>
        )}

        {showCompareSchedule && (
          <div className="flex flex-col gap-3 sm:block sm:gap-0">
            <label className="relative mr-5 inline-flex cursor-pointer items-center">
              <input
                checked={displayUserSlots}
                onChange={() => {
                  setDisplayUserSlots((prev) => !prev);
                  setTimeSlots(() =>
                    combineFreeAndMergedTimeSlots(
                      !displayUserSlots,
                      displayOtherSlots,
                      displayFreeSlots
                    )
                  );
                }}
                type="checkbox"
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-red-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-red-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-red-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                My schedule
              </span>
            </label>

            <label className="relative mr-5 inline-flex cursor-pointer items-center">
              <input
                checked={displayOtherSlots}
                onChange={() => {
                  setDisplayOtherSlots((prev) => !prev);
                  setTimeSlots(() =>
                    combineFreeAndMergedTimeSlots(
                      displayUserSlots,
                      !displayOtherSlots,
                      displayFreeSlots
                    )
                  );
                }}
                type="checkbox"
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                {`${userName}'s`} schedule
              </span>
            </label>

            <label className="relative mr-5 inline-flex cursor-pointer items-center">
              <input
                checked={displayFreeSlots}
                onChange={() => {
                  setDisplayFreeSlots((prev) => !prev);
                  setTimeSlots(() =>
                    combineFreeAndMergedTimeSlots(
                      displayUserSlots,
                      displayOtherSlots,
                      !displayFreeSlots
                    )
                  );
                }}
                type="checkbox"
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-green-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-green-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                Free times
              </span>
            </label>
          </div>
        )}
        
        <div className="w-full px-1 sm:w-5/6 lg:w-4/6">
          <ScheduleBox timeSlots={timeSlots} />
        </div>
      </div>
    </div>
  );
};

export default CompareSchedulePage;