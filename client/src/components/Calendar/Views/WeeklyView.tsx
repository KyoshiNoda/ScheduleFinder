import { generateWeekDates } from '../../../utils/scheduleUtils';
import { format } from 'date-fns';
import { WEEK_DAYS, CALENDAR_HOURS, TODAY } from '../../../utils/constants';
import { cn } from '../../../utils/functions';
import { isSameDay } from 'date-fns';

type Props = {
  initialDisplayDate: Date;
};

const getNumberOfTimeBlocks = (): number => {
  const hoursAWeek = 168;
  const slotsPerHour = hoursAWeek * 2;
  const additionalSlotRow = 7;

  return slotsPerHour + additionalSlotRow;
};

const WeeklyView = ({ initialDisplayDate }: Props) => {
  const dates = generateWeekDates(initialDisplayDate);

  return (
    <div className="relative h-[750px] w-full overflow-y-scroll pl-12 pr-7">
      <div className="absolute left-[10px] top-[74px] flex flex-col gap-y-24">
        {CALENDAR_HOURS.map((hour) => (
          <span key={hour} className="text-xs text-gray-400">
            {hour}
          </span>
        ))}
      </div>
      <div className="sticky top-0 z-10 grid grid-cols-7 bg-white shadow">
        {dates.map((date, index) => (
          <div
            key={index}
            className="flex h-14 items-center justify-center gap-1 border-[0.5px] text-sm"
          >
            <span className={cn('text-gray-500', { 'text-blue-700': isSameDay(date, TODAY) })}>
              {WEEK_DAYS[index]}
            </span>{' '}
            <span
              className={cn('font-semibold', {
                'rounded-full bg-blue-700 p-1 text-white': isSameDay(date, TODAY),
              })}
            >
              {format(date, 'd')}
            </span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {new Array(getNumberOfTimeBlocks()).fill('_').map((_, index) => (
          <div key={index} className={cn('h-14 border-[0.5px]', { 'h-7': index < 7 })}></div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyView;
