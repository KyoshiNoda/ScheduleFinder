import ScheduleHorizontalLines from '../../Schedule/ScheduleHorziontalLines';
import ScheduleHours from '../../Schedule/ScheduleHours';
import TimeSlot from '../../TimeSlot/TimeSlot';
import { useEffect, useRef } from 'react';
import { TimeSlot as TimeSlotType } from '../../../types';
import { calculateHeight, calculateDistanceFromTop } from '../../../utils/scheduleUtils';
import { useGetScheduleQuery } from '../../../redux/services/auth/authService';
import { format } from 'date-fns';

type Props = {
  currentDate: Date;
};

const DailyView = ({ currentDate }: Props) => {
  const { data, isFetching } = useGetScheduleQuery('schedule', {
    pollingInterval: 900000,
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      const currentHour = currentDate.getHours();
      const currentHourPosition = (currentHour * 60 * 72) / 60 + 20;
      scrollRef.current.scrollTop = currentHourPosition;
    }
  }, [currentDate]);

  return (
    <div className="flex h-full w-full flex-col border shadow dark:border-none dark:shadow-none">
      <div ref={scrollRef} className="relative h-full overflow-auto">
        <div className="relative h-full w-full">
          <ScheduleHours />
          {!isFetching &&
            data.timeSlots
              .filter(
                (timeSlot: TimeSlotType) => timeSlot.days[format(currentDate, 'EEEE').toLowerCase()]
              )
              .map((timeSlot: TimeSlotType) => (
                <div className="relative w-2/3 px-24 md:w-5/6 md:px-44" key={timeSlot._id}>
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
                </div>
              ))}
          <ScheduleHorizontalLines />
        </div>
      </div>
    </div>
  );
};

export default DailyView;
