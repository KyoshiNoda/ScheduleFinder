import { useState, useEffect } from 'react';
import Axios from 'axios';
import dayjs from 'dayjs/esm';
import customParseFormat from 'dayjs/esm/plugin/customParseFormat';
import localizedFormat from 'dayjs/esm/plugin/localizedFormat';
import 'dayjs/locale/en';
dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.locale('en');

type Props = {}
type TimeSlot = {
  day: string;
  category: string;
  title: string;
  startTime: string;
  endTime: string;
  color: string;
  location?: string;
  professor?: string;
}
type Schedule = {
  _id  : string;
  user_id : string;
  visibility : string;
  timeSlot:  TimeSlot[]
}
function Schedule({ }: Props) {
  const [schedules, setSchedules] = useState<[Schedule]>();
  useEffect(() => {
    Axios.get('http://localhost:3001/api/schedules')
      .then((res) => {
        setSchedules(res.data);
      })
  }, [])
  const timeSlot = schedules?.[0].timeSlot[0]; // a single timeSlot from DB
  const startTime = dayjs(timeSlot?.startTime, 'h:mm A'); // 2023-03-21T10:25:00-04:00
  const endTime = dayjs(timeSlot?.endTime, 'h:mm A'); // 2023-03-21T12:30:00-04:00
  const totalTime = endTime.diff(startTime, 'hours'); // total time from timeSlot
  console.log(totalTime);
  return (
    <div>Schedule</div>
  )
}

export default Schedule