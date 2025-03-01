import { format } from 'date-fns';
import { generateMonthlyDates } from '../../../utils/scheduleUtils';
import { useState } from 'react';
const MonthlyView = ({currentDate}) => {

  const dates = generateMonthlyDates(currentDate);

  const prevMonth = () => {};
  const nextMonth = () => {};

  return (
    <div className="grid h-full grid-cols-7 p-2">
      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
        <div className="border-b text-center font-bold" key={day}>
          {day}
        </div>
      ))}
      {dates.map((date) => (
        <div
          className={`border-collapse border px-4 py-1 text-sm ${
            format(date, 'MM') === format(currentDate, 'MM')
              ? 'text-black dark:text-white'
              : 'text-gray-400 dark:text-gray-600'
          }`}
          key={date.toISOString()}
        >
          {format(date, 'd')}
        </div>
      ))}
    </div>
  );
};

export default MonthlyView;
