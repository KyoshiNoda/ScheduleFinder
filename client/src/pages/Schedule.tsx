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
        console.log(res.data)
      })
  }, [])
  const timeBlock = schedules?.[0].timeSlot[0]
  const startTime = dayjs(timeBlock?.startTime, 'h:mm A');
  const endTime = dayjs(timeBlock?.endTime, 'h:mm A');
  const totalTime = endTime.diff(startTime, 'hours');
  console.log(timeBlock);
  console.log(totalTime);

  return (
    <div>Schedule</div>
  )
}

export default Schedule