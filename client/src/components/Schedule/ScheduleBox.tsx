import { useEffect, useRef } from 'react';
import { TimeSlot as TimeSlotType } from '../../types';
import TimeSlot from '../TimeSlot/TimeSlot';
import { useGetScheduleQuery } from '../../redux/services/schedule/scheduleService';
import {
  calculateHeight,
  calculateDistanceFromTop,
  convertTimeToMinutes,
} from '../../utils/scheduleUtils';
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
  const scheduleTimeSlots = timeSlots ?? data?.timeSlots ?? [];

  // TODO: Temporary removed SAT/SUN since inactive.
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  const dayNames = ['m', 't', 'w', 'th', 'f'];
  const timeColumnWidth = 64;
  const dayColumnMinWidth = 180;
  const scheduleHeight = 1780;
  const scheduleMinWidth = timeColumnWidth + dayColumnMinWidth * days.length;
  const scheduleGridTemplate = `${timeColumnWidth}px repeat(${days.length}, minmax(${dayColumnMinWidth}px, 1fr))`;
  const defaultScrollTop = (6 * 60 * 72) / 60 + 20;

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      if (scheduleTimeSlots.length === 0) {
        scrollRef.current.scrollTop = defaultScrollTop;
        return;
      }

      const earliestStartInMinutes = Math.min(
        ...scheduleTimeSlots.map((timeSlot: TimeSlotType) => {
          const [hour, minutes] = convertTimeToMinutes(timeSlot.startTime);
          return hour * 60 + minutes;
        })
      );

      const scrollPaddingInMinutes = 30;
      const targetStartInMinutes = Math.max(0, earliestStartInMinutes - scrollPaddingInMinutes);
      const dynamicScrollTop = Math.max(0, (targetStartInMinutes * 72) / 60 + 20);

      scrollRef.current.scrollTop = dynamicScrollTop;
    }
  }, [defaultScrollTop, scheduleTimeSlots]);

  return (
    <div className="flex w-full flex-col border shadow dark:border-none dark:shadow-none">
      <div
        ref={scrollRef}
        className="relative mb-6 h-[678px] overflow-auto rounded bg-white dark:bg-black dark:text-white"
      >
        <div className="sticky top-0 z-20 bg-white dark:bg-black">
          <div
            className="grid"
            style={{ gridTemplateColumns: scheduleGridTemplate, minWidth: `${scheduleMinWidth}px` }}
          >
            <div />
            {days.map((day, index) => (
              <div key={day} className="relative">
                <h2 className="z-20 py-2 text-center text-lg font-medium capitalize">
                  {window.innerWidth < 535 ? dayNames[index] : day}
                </h2>
              </div>
            ))}
          </div>
        </div>

        <div className="relative" style={{ minWidth: `${scheduleMinWidth}px` }}>
          <div className="grid" style={{ gridTemplateColumns: scheduleGridTemplate }}>
            <div />
            {days.map((day) => (
              <div key={day} className="relative" style={{ height: `${scheduleHeight}px` }}>
                {!isFetching &&
                  scheduleTimeSlots
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
          <ScheduleHorziontalLines
            scheduleHeight={scheduleHeight}
            timeColumnWidth={timeColumnWidth}
          />
          <ScheduleVerticalLines
            dayCount={days.length}
            scheduleHeight={scheduleHeight}
            timeColumnWidth={timeColumnWidth}
          />
        </div>
      </div>
    </div>
  );
};

export default ScheduleBox;
