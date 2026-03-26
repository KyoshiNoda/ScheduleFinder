import { format, isSameMonth } from 'date-fns';
import { generateMonthDates } from '../../../utils/scheduleUtils';
import { WEEK_DAYS, TODAY } from '../../../utils/constants';
import { cn } from '../../../utils/functions';
import { isSameDay } from 'date-fns';

type Props = {
  initialDisplayDate: Date;
};

const MonthlyView = ({ initialDisplayDate }: Props) => {
  const dates = generateMonthDates(initialDisplayDate);

  // This function keeps the dates array at a length of 35 so that no more than 35 slots
  // are displayed per month, making it easier to a handle the height of the calendar.
  const trimDates = (dates: Date[]): Date[] => {
    let start = 0,
      end = dates.length - 1;

    while (dates.length > 35) {
      if (!isSameMonth(initialDisplayDate, dates[start])) {
        dates.shift();
        start += 1;
      }

      if (!isSameMonth(initialDisplayDate, dates[end])) {
        dates.pop();
        end -= 1;
      }
    }

    return dates;
  };

  return (
    <div className="h-full w-full">
      <div className="grid grid-cols-7">
        {WEEK_DAYS.map((day) => (
          <div
            className="border-[0.5px] py-2 text-center text-sm font-semibold dark:border-gray-700"
            key={day}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid h-full w-full grid-cols-7">
        {trimDates(dates).map((date) => (
          <div
            className={cn(
              'h-16 border-collapse border-[0.5px] px-3 py-2 text-sm dark:border-gray-700 lg:h-36',
              {
                'dark:bg-darkMuted bg-gray-50': !isSameMonth(date, initialDisplayDate),
              }
            )}
            key={date.toISOString()}
          >
            <span
              className={cn({
                'rounded-full bg-blue-700 px-[8.5px] py-[3px] text-white': isSameDay(date, TODAY),
              })}
            >
              {format(date, 'd')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyView;
