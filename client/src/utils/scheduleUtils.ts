import { TimeSlot, DaysChecked } from '../types';

export function convertTo24Hour(time12: any) {
  let [hour, minute] = time12.split(':');
  let period = time12.slice(-2);
  hour = parseInt(hour);
  if (period === 'PM' && hour !== 12) {
    hour += 12;
  }
  if (period === 'AM' && hour === 12) {
    hour = 0;
  }
  return hour * 60 + parseInt(minute);
};

export function isBetween(
  startTime: string,
  endTime: string,
  targetTime: string
) {
  const start = new Date(`2022-01-01 ${startTime}`);
  const end = new Date(`2022-01-01 ${endTime}`);
  const target = new Date(`2022-01-01 ${targetTime}`);
  return start <= target && target <= end;
};

export function validTimeSlot(
  startTime: string,
  endTime: string,
  data: any,
  days: DaysChecked
): boolean {
  let result: boolean = true;
  data.forEach((timeSlot: TimeSlot) => {
    if (
      days.monday &&
      timeSlot.days.monday &&
      isBetween(startTime, endTime, timeSlot.startTime)
    ) {
      result = false;
    }
    if (
      days.tuesday &&
      timeSlot.days.tuesday &&
      isBetween(startTime, endTime, timeSlot.startTime)
    ) {
      result = false;
    }
    if (
      days.wednesday &&
      timeSlot.days.wednesday &&
      isBetween(startTime, endTime, timeSlot.startTime)
    ) {
      return false;
    }
    if (
      days.thursday &&
      timeSlot.days.thursday &&
      isBetween(startTime, endTime, timeSlot.startTime)
    ) {
      result = false;
    }
    if (
      days.friday &&
      timeSlot.days.friday &&
      isBetween(startTime, endTime, timeSlot.startTime)
    ) {
      result = false;
    }
  });
  return result;
};
