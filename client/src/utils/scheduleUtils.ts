import { TimeSlot, DaysChecked } from '../types';

export const convertTo24Hour = (time12: any) => {
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
export const isBetween = (startTime: string, endTime: string, targetTime: string) => {
  const start = new Date(`2022-01-01 ${startTime}`);
  const end = new Date(`2022-01-01 ${endTime}`);
  const target = new Date(`2022-01-01 ${targetTime}`);
  return start <= target && target <= end;
};

export const validTimeSlot = (startTime: string, endTime: string, data: any, days: DaysChecked): boolean => {
  let result: boolean = true;
  data.forEach((timeSlot: TimeSlot) => {
    if (days.monday && timeSlot.days.monday && isBetween(startTime, endTime, timeSlot.startTime)) {
      result = false;
    }
    if (days.tuesday && timeSlot.days.tuesday && isBetween(startTime, endTime, timeSlot.startTime)) {
      result = false;
    }
    if (days.wednesday && timeSlot.days.wednesday && isBetween(startTime, endTime, timeSlot.startTime)) {
      return false;
    }
    if (days.thursday && timeSlot.days.thursday && isBetween(startTime, endTime, timeSlot.startTime)) {
      result = false;
    }
    if (days.friday && timeSlot.days.friday && isBetween(startTime, endTime, timeSlot.startTime)) {
      result = false;
    }
  });
  return result;
};

const convertTimeToMinutes = (time: string) => {
  const lastTwoChars: string = time.slice(time.length - 2, time.length);
  time = time.slice(0, time.indexOf(' '));
  const [hour, minutes] = time.split(':');

  let hourNumber: number = parseInt(hour);
  const minutesNumber: number = parseInt(minutes);

  if (lastTwoChars === 'PM' && hourNumber < 12) {
    hourNumber += 12;
  }

  return [hourNumber, minutesNumber];
};

export const calculateHeight = (startTime: string, endTime: string) => {
  const [startHour, startMinutes] = convertTimeToMinutes(startTime);
  const [endHour, endMinutes] = convertTimeToMinutes(endTime);

  let hours: number = endHour - startHour;
  let minutes: number = endMinutes - startMinutes;

  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }

  const totalMinutes: number = hours * 60 + minutes;
  const height: number = (totalMinutes * 72) / 60;

  return height.toString();
};

const calculateMinutesFromTop = (time: string) => {
  const [hour, minutes] = convertTimeToMinutes(time);
  const minutesFromTop: number = (hour - 7) * 60 + minutes;
  return minutesFromTop;
};

export const calculateDistanceFromTop = (startTime: string) => {
  const minutes: number = calculateMinutesFromTop(startTime);
  const distanceFromTop: number = (minutes * 72) / 60;
  return distanceFromTop.toString();
};
