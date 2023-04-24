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
}
