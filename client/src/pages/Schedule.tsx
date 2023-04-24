import TimeSlotInput from '../components/Schedule/TimeSlotInput';
import ScheduleBox from '../components/Schedule/ScheduleBox';
import Toggle from '../components/Toggle';

type Props = {};

function Schedule({}: Props) {
  return (
    <div className="flex h-[1110px] min-h-full flex-col gap-10 bg-slate-400 px-8 dark:bg-slate-900 2xl:px-12">
      <div className="flex justify-end">
        <Toggle />
      </div>
      <div className="flex gap-4 2xl:gap-10">
        <ScheduleBox />
        <TimeSlotInput />
      </div>
    </div>
  );
}

export default Schedule;
