import { format } from 'date-fns';
import { generateMonthDates } from '../../../utils/scheduleUtils';
import { WEEK_DAYS } from '../../../utils/constants';

type Props = {
  currentDate: Date;
};

const MonthlyView = ({ currentDate }: Props) => {
  const dates = generateMonthDates(currentDate);

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
            className={`h-16 border-collapse border-[0.5px] px-4 py-1 text-sm lg:h-36  ${
              format(date, 'MM') === format(currentDate, 'MM')
                ? 'text-black dark:text-white'
                : 'bg-gray-50 text-gray-400 dark:text-gray-600'
            }`}
            key={date.toISOString()}
          >
            {format(date, 'd')}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyView;
