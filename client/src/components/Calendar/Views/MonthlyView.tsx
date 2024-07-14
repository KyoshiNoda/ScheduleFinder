import React from 'react';
import { format, isSameDay } from 'date-fns';
import { generateMonthlyDates } from '../../../utils/scheduleUtils';
type Props = {
  currentDate: Date;
};
const MonthlyView = ({ currentDate }: Props) => {
  const dates = generateMonthlyDates(currentDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today's date to midnight

  return (
    <div className="grid h-full grid-cols-7 p-2">
      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
        <div className="border-b text-center font-bold" key={day}>
          {day}
        </div>
      ))}
      {dates.map((date) => (
        <div
          className={`relative border-collapse border px-4 py-1 text-sm ${
            format(date, 'MM') === format(currentDate, 'MM')
              ? 'text-black dark:text-white'
              : 'text-gray-400 dark:text-gray-600'
          }`}
          key={date.toISOString()}
        >
          <div
            className={`${
              isSameDay(date, today)
                ? 'flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white dark:bg-blue-700'
                : ''
            }`}
          >
            {format(date, 'd')}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MonthlyView;
