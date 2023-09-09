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

const CompareSchedule = () => {
  const { userId } = useParams();

  const dispatch = useAppDispatch();
  dispatch(toggleReadOnly(true));

  // This states are used to conditionallly render the titles of the schedules and the toggles.
  const [showOtherSchedule, setShowOtherSchedule] = useState<boolean>(true);
  const [showUserSchedule, setShowUserSchedule] = useState<boolean>(false);
  const [showCompareSchedule, setShowCompareSchedule] =
    useState<boolean>(false);

  // These are the states of the toggles
  const [displayUserSlots, setDisplayUserSlots] = useState<boolean>(true);
  const [displayOtherSlots, setDisplayOtherSlots] = useState<boolean>(true);
  const [displayFreeSlots, setDisplayFreeSlots] = useState<boolean>(true);

  // This state represents the current time slots that are being displayed in the schedule box.
  const [timeSlots, setTimeSlots] = useState<TimeSlotType[] | undefined>([]);

  // The first index of data represents scheduleA (the schedule of the user that is logged in).
  const { data, isFetching } = useGetScheduleQuery('schedule', {
    pollingInterval: 900000,
  });

  // This schedule is used to initialize the scheduleB state with an initial schedule and avoid
  // annoying errors about it being undefined.
  const defaultSchedule = {
    _id: '',
    user_id: '',
    visibility: '',
    timeSlots: [],
  };

  // Schedule B is the schedule to compare against.
  const [scheduleB, setScheduleB] = useState<ScheduleType>(defaultSchedule);

  useEffect(() => {
    fetch(`${BASE_URL}api/schedules/${userId}/user`)
      .then((res) => res.json())
      .then((data) => {
        setScheduleB(data);
        setTimeSlots(data.timeSlot);
      })
      .catch((err) => console.log(err));
  }, []);

  // State used to store the name of the user that will be displayed in the page.
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    fetch(`${BASE_URL}api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => setUserName(data.firstName))
      .catch((err) => console.log(err));
  }, []);

  const mergeTimeSlots = () => {
    const timeSlotsA = data.timeSlots.map((timeSlot: TimeSlotType) => {
      return { ...timeSlot, color: 'red', _id: crypto.randomUUID() };
    });
    const timeSlotsB = scheduleB.timeSlots.map((timeSlot: TimeSlotType) => {
      return { ...timeSlot, color: 'blue', _id: crypto.randomUUID() };
    });

    const mergedTimeSlots: TimeSlotType[] = [...timeSlotsA, ...timeSlotsB];
    return mergedTimeSlots;
  };

  // This function is used to sort the time slots by their startTime.
  const compareTimeSlots = (a: TimeSlotType, b: TimeSlotType) => {
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

  const findFreeIntervals = (timeSlots: TimeSlotType[], day: string) => {
    timeSlots.sort(compareTimeSlots);

    const free: TimeSlotType[] = [];
    let combined: TimeSlotType[] = [...timeSlots];
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
        _id: crypto.randomUUID(),
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
    const mergedTimeSlots: TimeSlotType[] = mergeTimeSlots();

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

  const combineFreeAndMergedTimeSlots = (
    isChecked1 = true,
    isChecked2 = true,
    isChecked3 = true
  ) => {
    const mergedTimeSlots = mergeTimeSlots();
    const userTimeSlots = mergedTimeSlots.filter(
      (timeSlot) => timeSlot.color === 'red'
    );
    const otherTimeSlots = mergedTimeSlots.filter(
      (timeSlot) => timeSlot.color === 'blue'
    );

    const timeSlotsToDisplay = [];
    if (isChecked1) timeSlotsToDisplay.push(...userTimeSlots);
    if (isChecked2) timeSlotsToDisplay.push(...otherTimeSlots);
    if (isChecked3) timeSlotsToDisplay.push(...getFreeTimeSlots());

    return timeSlotsToDisplay;
  };

  return (
    <div className="min-h-full bg-slate-400 p-6 dark:bg-slate-900">
      <div className="mt-5 flex flex-col items-center gap-16">
        <Button.Group outline={true}>
          <Button
            onClick={() => {
              setTimeSlots(scheduleB.timeSlots);
              setShowCompareSchedule(false);
              setShowOtherSchedule(true);
              setShowUserSchedule(false);
              setDisplayUserSlots(true);
              setDisplayOtherSlots(true);
              setDisplayFreeSlots(true);
            }}
            color="gray"
          >
            {`${userName}'s`} schedule
          </Button>
          <Button
            onClick={() => {
              setTimeSlots(data.timeSlots);
              setShowCompareSchedule(false);
              setShowOtherSchedule(false);
              setShowUserSchedule(true);
              setDisplayUserSlots(true);
              setDisplayOtherSlots(true);
              setDisplayFreeSlots(true);
            }}
            color="gray"
          >
            My schedule
          </Button>
          <Button
            onClick={() => {
              setTimeSlots(() => combineFreeAndMergedTimeSlots());
              setShowCompareSchedule(true);
              setShowOtherSchedule(false);
              setShowUserSchedule(false);
            }}
            color="gray"
          >
            Compare schedules
          </Button>
        </Button.Group>

        {showOtherSchedule && (
          <h1 className="text-center text-4xl dark:text-white">{`${userName}'s Schedule`}</h1>
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

export default CompareSchedule;
