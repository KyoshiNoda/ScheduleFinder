import React from 'react';
import { useState } from 'react';
import { startOfWeek, endOfWeek, addDays } from 'date-fns';
import { generateWeekDates } from '../../../utils/scheduleUtils';
import { format } from 'date-fns';
import { WEEK_DAYS, CALENDAR_HOURS } from '../../../utils/constants';

type Props = {
  currentDate: Date;
};

const getNumberOfTimeBlocks = () => {
  const hoursAWeek = 168;
  const slotsPerHour = hoursAWeek * 2;
  const additionalSlotRow = 7;

  return slotsPerHour + additionalSlotRow;
};

const WeeklyView = ({ currentDate }: Props) => {
  const dates = generateWeekDates();
  console.log('dates:', dates);
  return (
    <div className="relative h-[750px] w-full overflow-y-scroll pl-12 pr-7">
      <div className="absolute left-[10px] top-[74px] flex flex-col gap-y-24">
        {CALENDAR_HOURS.map((hour) => (
          <span className="text-xs text-gray-400">{hour}</span>
        ))}
      </div>
      <div className="sticky top-0 z-10 grid grid-cols-7 bg-white shadow">
        {dates.map((date, index) => (
          <div className="flex h-14 items-center justify-center gap-1 border-[0.5px] text-sm">
            <span className="text-gray-500">{WEEK_DAYS[index]}</span>{' '}
            <span className="font-semibold">{format(date, 'd')}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {new Array(getNumberOfTimeBlocks()).fill('_').map((_, index) => (
          <div className={`border-[0.5px] ${index < 7 ? 'h-7' : 'h-14'}`}></div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyView;
