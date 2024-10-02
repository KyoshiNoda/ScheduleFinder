import { generateWeekDates } from '../../../utils/scheduleUtils';
import { format } from 'date-fns';
import { WEEK_DAYS, CALENDAR_HOURS, TODAY } from '../../../utils/constants';
import { cn } from '../../../utils/functions';
import { isSameDay } from 'date-fns';
import { useMemo } from 'react';

type Props = {
  initialDisplayDate: Date;
};

// There are 168 hours in a week.
// We are displaying 2 slots per hour so that's 168 * 2 = 336
// We have an additional row at the top so that's 336 + 7 = 343
const NUMBER_OF_SLOTS = 343;

const LIGHT_MODE_BORDER = 'border-gray-200';
const DARK_MODE_BORDER = 'dark:border-gray-700';

// We add thicker borders if the slot is in the left or right edge.
const useThickerBorders = (index: number) => ({
  'border-l-[1px]': index % 7 === 0,
  'border-r-[1px]': (index + 1) % 7 === 0,
});

const WeeklyView = ({ initialDisplayDate }: Props) => {
  const dates = useMemo(() => generateWeekDates(initialDisplayDate), [initialDisplayDate]);

  return (
    <>
      <div
        className={cn(
          'sticky top-0 z-10 grid grid-cols-7 border-b-[0.5px] bg-white pl-12 pr-7 shadow dark:bg-slate-900',
          LIGHT_MODE_BORDER,
          DARK_MODE_BORDER
        )}
      >
        {dates.map((date, index) => (
          <div
            key={date.getTime()}
            className={cn(
              'flex h-14 items-center justify-center gap-1 border-x-[0.5px] text-sm dark:bg-slate-900',
              LIGHT_MODE_BORDER,
              DARK_MODE_BORDER,
              useThickerBorders(index)
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
                'rounded-full bg-blue-700 py-[2px] px-[9px] text-white': isSameDay(date, TODAY),
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
          {[...Array(NUMBER_OF_SLOTS)].map((_, index) => (
            <div
              key={index}
              className={cn('h-14 border-[0.5px]', LIGHT_MODE_BORDER, DARK_MODE_BORDER, {
                'h-7 border-t-0': index < 7,
                ...useThickerBorders(index),
              })}
            ></div>
          ))}
        </div>
      </div>
    </>
  );
};

export default WeeklyView;
