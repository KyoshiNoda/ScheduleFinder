import React from 'react';
import { useState } from 'react';
import { startOfWeek, endOfWeek, addDays } from 'date-fns';
import { generateWeekDates } from '../../../utils/scheduleUtils';
import { format } from 'date-fns';
import { WEEK_DAYS } from '../../../utils/constants';

type Props = {
  currentDate: Date;
};

const HOURS = [
  '12AM',
  '1AM',
  '2AM',
  '3AM',
  '4AM',
  '5AM',
  '6AM',
  '7AM',
  '8AM',
  '9AM',
  '10AM',
  '11AM',
  '12PM',
  '1PM',
  '2PM',
  '3PM',
  '4PM',
  '5PM',
  '6PM',
  '7PM',
  '8PM',
  '9PM',
  '10PM',
  '11PM',
];

const WeeklyView = ({ currentDate }: Props) => {
  const dates = generateWeekDates();

  return (
    <div className="h-[750px] w-full overflow-y-scroll pl-12 pr-7">
      <div className="sticky top-0 z-10 grid grid-cols-7 bg-white shadow">
        {dates.map((date, index) => (
          <div className="flex h-14 items-center justify-center gap-1 border-[0.5px] text-sm">
            <span className="text-gray-500">{WEEK_DAYS[index]}</span>{' '}
            <span className="font-semibold">{format(date, 'd')}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {new Array(336).fill(0).map((_, index) => (
          <div className={`border-[0.5px] ${index < 7 ? 'h-7' : 'h-14'}`}></div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyView;
