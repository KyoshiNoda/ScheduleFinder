import { format } from 'date-fns';
import { generateMonthDates } from '../../../utils/scheduleUtils';
import { WEEK_DAYS, TODAY } from '../../../utils/constants';
import { cn } from '../../../utils/functions';
import { isSameDay } from 'date-fns';

type Props = {
  initialDisplayDate: Date;
};

const MonthlyView = ({ initialDisplayDate }: Props) => {
  const dates = generateMonthDates(initialDisplayDate);

  return (
    <div className="h-full w-full">
      <div className="grid grid-cols-7">
        {WEEK_DAYS.map((day) => (
          <div className="border-[0.5px] py-2 text-center text-sm font-semibold" key={day}>
            {day}
          </div>
        ))}
      </div>
      <div className="grid h-full w-full grid-cols-7">
        {dates.map((date) => (
          <div
            className="h-16 border-collapse border-[0.5px] px-3 py-2 text-sm lg:h-36"
            key={date.toISOString()}
          >
            <span
              className={cn({
                'rounded-full bg-blue-700 p-1 text-white': isSameDay(date, TODAY),
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
