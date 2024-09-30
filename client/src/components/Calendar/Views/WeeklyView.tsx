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
    <>
      <div className="sticky top-0 z-10 grid grid-cols-7 border-b-[0.5px] bg-white pl-12 pr-7 shadow dark:border-gray-700 dark:bg-slate-900">
        {dates.map((date, index) => (
          <div
            key={index}
            className={cn(
              'flex h-14 items-center justify-center gap-1 border-x-[0.5px] text-sm dark:border-gray-700 dark:bg-slate-900',
              { 'border-l-[1px]': index === 0, 'border-r-[1px]': index === 6 }
            )}
          >
            <span
              className={cn('text-gray-500 dark:text-gray-300', {
                'text-blue-700': isSameDay(date, TODAY),
              })}
            >
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

      <div className="relative h-[750px] w-full overflow-y-scroll pl-12 pr-7">
        <div className="absolute left-[10px] top-[74px] flex flex-col gap-y-24">
          {CALENDAR_HOURS.map((hour) => (
            <span key={hour} className="text-xs text-gray-400">
              {hour}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {new Array(getNumberOfTimeBlocks()).fill('_').map((_, index) => (
            <div
              key={index}
              className={cn('h-14 border-[0.5px] dark:border-gray-700', {
                'h-7 border-t-0': index < 7,
                'border-l-[1px]': index % 7 === 0,
                'border-r-[1px]': (index + 1) % 7 === 0,
              })}
            ></div>
          ))}
        </div>
      </div>
    </>
  );
};

export default WeeklyView;
