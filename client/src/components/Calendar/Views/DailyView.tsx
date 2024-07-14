import ScheduleHorizontalLines from '../../Schedule/ScheduleHorziontalLines';
import ScheduleHours from '../../Schedule/ScheduleHours';
import ScheduleVerticalLines from '../../Schedule/ScheduleVerticalLines';
import TimeSlot from '../../TimeSlot/TimeSlot';
import { useEffect, useRef } from 'react';
import { TimeSlot as TimeSlotType } from '../../../types';
import { calculateHeight, calculateDistanceFromTop } from '../../../utils/scheduleUtils';
import { useGetScheduleQuery } from '../../../redux/services/auth/authService';

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
      const sixAMPosition = (6 * 60 * 72) / 60 + 20;
      scrollRef.current.scrollTop = sixAMPosition;
    }
  }, []);

  return (
    <div className="flex h-full w-full flex-col border shadow dark:border-none dark:shadow-none">
      <div ref={scrollRef} className="relative h-full overflow-auto">
        <div className="relative h-full w-5/6">
          <ScheduleHours />
          {!isFetching &&
            data.timeSlots
              .filter((timeSlot: TimeSlotType) => timeSlot.days['monday'])
              .map((timeSlot: TimeSlotType) => (
                <div className='px-20'>
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
