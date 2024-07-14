import { format } from 'date-fns';
import { generateMonthlyDates } from '../../../utils/scheduleUtils';

type Props = {
  currentDate: Date;
};

const MonthlyView = ({ currentDate }: Props) => {
  const dates = generateMonthlyDates(currentDate);

  return (
    <div className="h-full w-full">
      <div className="grid grid-cols-7">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
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
