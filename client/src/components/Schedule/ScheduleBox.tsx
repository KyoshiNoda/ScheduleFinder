import React, { useEffect, useRef } from 'react';
import { TimeSlot as TimeSlotType } from '../../types';
import TimeSlot from './TimeSlot';
import { useGetScheduleQuery } from '../../redux/services/schedule/scheduleService';
import { calculateHeight, calculateDistanceFromTop } from '../../utils/scheduleUtils';
import ScheduleHorziontalLines from './ScheduleHorziontalLines';
import ScheduleHours from './ScheduleHours';
import ScheduleVerticalLines from './ScheduleVerticalLines';

type Props = {
  timeSlots: TimeSlotType[] | undefined;
};

const ScheduleBox = ({ timeSlots }: Props) => {
  const { data, isFetching } = useGetScheduleQuery('schedule', {
    pollingInterval: 900000,
  });

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayNames = ['m', 't', 'w', 'th', 'f', 'sat', 'sun'];

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const sixAMPosition = (6 * 60 * 72) / 60 + 20;
      scrollRef.current.scrollTop = sixAMPosition;
    }
  }, []);

  return (
    <div className="flex w-full flex-col border shadow dark:border-none dark:shadow-none">
      <div className="relative mb-6 h-[678px] overflow-scroll rounded bg-white dark:bg-black dark:text-white">
        <div className="sticky top-0 z-10 bg-white dark:bg-black">
          <div className="mx-20 grid grid-cols-7">
            {days.map((day, index) => (
              <div key={day} className="relative">
                <h2 className="py-2 text-center text-lg font-medium capitalize z-20">
                  {window.innerWidth < 535 ? dayNames[index] : day}
                </h2>
              </div>
            ))}
          </div>
        </div>
        <div ref={scrollRef} className="relative h-full overflow-auto">
          <div className="relative mx-20 grid h-full grid-cols-7 gap-3">
            {days.map((day, index) => (
              <div key={day} className="relative h-full">
                {timeSlots
                  ? timeSlots
                      .filter((timeSlot: TimeSlotType) => timeSlot.days[day])
                      .map((timeSlot: TimeSlotType) => (
                        <TimeSlot
                          key={timeSlot._id}
                          id={timeSlot._id}
                          top={calculateDistanceFromTop(timeSlot.startTime)}
                          height={calculateHeight(timeSlot.startTime, timeSlot.endTime)}
                          title={timeSlot.title}
                          startTime={timeSlot.startTime}
                          endTime={timeSlot.endTime}
                          location={timeSlot.location}
                          professor={timeSlot.professor}
                          color={timeSlot.color}
                          days={timeSlot.days}
                        />
                      ))
                  : !isFetching &&
                    data.timeSlots
                      .filter((timeSlot: TimeSlotType) => timeSlot.days[day])
                      .map((timeSlot: TimeSlotType) => (
                        <TimeSlot
                          key={timeSlot._id}
                          id={timeSlot._id}
                          top={calculateDistanceFromTop(timeSlot.startTime)}
                          height={calculateHeight(timeSlot.startTime, timeSlot.endTime)}
                          title={timeSlot.title}
                          startTime={timeSlot.startTime}
                          endTime={timeSlot.endTime}
                          location={timeSlot.location}
                          professor={timeSlot.professor}
                          color={timeSlot.color}
                          days={timeSlot.days}
                        />
                      ))}
              </div>
            ))}
          </div>
          <ScheduleHours />
          <ScheduleHorziontalLines />
          <ScheduleVerticalLines />
        </div>
      </div>
    </div>
  );
};

export default ScheduleBox;
