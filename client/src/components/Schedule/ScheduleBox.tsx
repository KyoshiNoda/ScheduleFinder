import { TimeSlot as TimeSlotType } from '../../types';
import TimeSlot from './TimeSlot';
import { useGetScheduleQuery } from '../../redux/services/schedule/scheduleService';
import { calculateHeight, calculateDistanceFromTop } from '../../utils/scheduleUtils';
type Props = {
  timeSlots: TimeSlotType[] | undefined;
};

const ScheduleBox = ({ timeSlots }: Props) => {
  const { data, isFetching } = useGetScheduleQuery('schedule', {
    pollingInterval: 900000,
  });

  if (!isFetching) {
  }
  return (
    <>
      <div className="flex w-full flex-col border shadow dark:border-none dark:shadow-none">
        <div className="relative mb-6 flex h-[678px] rounded overflow-scroll bg-white dark:bg-black dark:text-white">
          <span className="absolute left-1 top-[20px] font-bold">12 AM</span>
          <span className="absolute left-1 top-[92px] font-bold">1 AM</span>
          <span className="absolute left-1 top-[164px] font-bold">2 AM</span>
          <span className="absolute left-1 top-[236px] font-bold">3 AM</span>
          <span className="absolute left-1 top-[308px] font-bold">4 AM</span>
          <span className="absolute left-1 top-[380px] font-bold">5 AM</span>
          <span className="absolute left-1 top-[452px] font-bold">6 AM</span>
          <span className="absolute left-1 top-[524px] font-bold">7 AM</span>
          <span className="absolute left-1 top-[596px] font-bold">8 AM</span>
          <span className="absolute left-1 top-[668px] font-bold">9 AM</span>
          <span className="absolute left-1 top-[740px] font-bold">10 AM</span>
          <span className="absolute left-1 top-[812px] font-bold">11 AM</span>
          <span className="absolute left-1 top-[884px] font-bold">12 PM</span>
          <span className="absolute left-1 top-[956px] font-bold">1 PM</span>
          <span className="absolute left-1 top-[1028px] font-bold">2 PM</span>
          <span className="absolute left-1 top-[1100px] font-bold">3 PM</span>
          <span className="absolute left-1 top-[1172px] font-bold">4 PM</span>
          <span className="absolute left-1 top-[1244px] font-bold">5 PM</span>
          <span className="absolute left-1 top-[1316px] font-bold">6 PM</span>
          <span className="absolute left-1 top-[1388px] font-bold">7 PM</span>
          <span className="absolute left-1 top-[1460px] font-bold">8 PM</span>
          <span className="absolute left-1 top-[1532px] font-bold">9 PM</span>
          <span className="absolute left-1 top-[1604px] font-bold">10 PM</span>
          <span className="absolute left-1 top-[1676px] font-bold">11 PM</span>

          <hr className="absolute top-0 w-full border-dotted bg-gray-400 dark:bg-gray-900" />
          <hr className="absolute top-[72px] w-full border-dotted bg-gray-400 dark:bg-gray-900" />
          <hr className="absolute top-[144px] w-full border-dotted bg-gray-400 dark:bg-gray-900" />
          <hr className="absolute top-[216px] w-full border-dotted bg-gray-400 dark:bg-gray-900" />
          <hr className="absolute top-[288px] w-full border-dotted bg-gray-400 dark:bg-gray-900" />
          <hr className="absolute top-[360px] w-full border-dotted bg-gray-400 dark:bg-gray-900" />
          <hr className="absolute top-[432px] w-full border-dotted bg-gray-400 dark:bg-gray-900" />
          <hr className="absolute top-[504px] w-full border-dotted bg-gray-400 dark:bg-gray-900" />
          <hr className="absolute top-[576px] w-full border-dotted bg-gray-400 dark:bg-gray-900" />
          <hr className="absolute top-[648px] w-full border-dotted bg-gray-400 dark:bg-gray-900" />
          <hr className="absolute top-[720px] w-full border-dotted bg-gray-400 dark:bg-gray-900" />
          <hr className="absolute top-[792px] w-full border-dotted bg-gray-400 dark:bg-gray-900" />
          <hr className="absolute top-[864px] w-full border-dotted bg-gray-400 dark:bg-gray-900" />
          <hr className="absolute top-[936px] w-full border-dotted bg-gray-400 dark:bg-gray-900" />
          <div className="relative mx-2 h-[1008px] w-1/5">
            <h2 className="absolute -inset-8 text-center text-lg font-medium capitalize">
              {window.innerWidth < 535 ? 'm' : 'monday'}
            </h2>
            {timeSlots
              ? timeSlots
                  .filter((timeSlot: TimeSlotType) => timeSlot.days.monday)
                  .map((timeSlot: TimeSlotType) => (
                    <TimeSlot
                      key={timeSlot._id}
                      id={timeSlot._id}
                      top={calculateDistanceFromTop(timeSlot.startTime)}
                      height={calculateHeight(timeSlot.startTime, timeSlot.endTime)}
                      title={timeSlot.title}
                      startTime={timeSlot.startTime}
                      endTime={timeSlot.endTime}
                      location={timeSlot.location}
                      professor={timeSlot.professor}
                      color={timeSlot.color}
                      days={timeSlot.days}
                    />
                  ))
              : !isFetching &&
                data.timeSlots
                  .filter((timeSlot: TimeSlotType) => timeSlot.days.monday)
                  .map((timeSlot: TimeSlotType) => (
                    <TimeSlot
                      key={timeSlot._id}
                      id={timeSlot._id}
                      top={calculateDistanceFromTop(timeSlot.startTime)}
                      height={calculateHeight(timeSlot.startTime, timeSlot.endTime)}
                      title={timeSlot.title}
                      startTime={timeSlot.startTime}
                      endTime={timeSlot.endTime}
                      location={timeSlot.location}
                      professor={timeSlot.professor}
                      color={timeSlot.color}
                      days={timeSlot.days}
                    />
                  ))}
          </div>
          <div className="relative mx-2 h-[1008px] w-1/5">
            <h2 className="absolute -inset-8 text-center text-lg font-medium capitalize">
              {window.innerWidth < 535 ? 't' : 'tuesday'}
            </h2>
            {timeSlots
              ? timeSlots
                  .filter((timeSlot: TimeSlotType) => timeSlot.days.tuesday)
                  .map((timeSlot: TimeSlotType) => (
                    <TimeSlot
                      key={timeSlot._id}
                      id={timeSlot._id}
                      top={calculateDistanceFromTop(timeSlot.startTime)}
                      height={calculateHeight(timeSlot.startTime, timeSlot.endTime)}
                      title={timeSlot.title}
                      startTime={timeSlot.startTime}
                      endTime={timeSlot.endTime}
                      location={timeSlot.location}
                      professor={timeSlot.professor}
                      color={timeSlot.color}
                      days={timeSlot.days}
                    />
                  ))
              : !isFetching &&
                data.timeSlots
                  .filter((timeSlot: TimeSlotType) => timeSlot.days.tuesday)
                  .map((timeSlot: TimeSlotType) => (
                    <TimeSlot
                      key={timeSlot._id}
                      id={timeSlot._id}
                      top={calculateDistanceFromTop(timeSlot.startTime)}
                      height={calculateHeight(timeSlot.startTime, timeSlot.endTime)}
                      title={timeSlot.title}
                      startTime={timeSlot.startTime}
                      endTime={timeSlot.endTime}
                      location={timeSlot.location}
                      professor={timeSlot.professor}
                      color={timeSlot.color}
                      days={timeSlot.days}
                    />
                  ))}
          </div>
          <div className="relative mx-2 h-[1008px] w-1/5">
            <h2 className="absolute -inset-8 text-center text-lg font-medium capitalize">
              {window.innerWidth < 535 ? 'w' : 'wednesday'}
            </h2>
            {timeSlots
              ? timeSlots
                  .filter((timeSlot: TimeSlotType) => timeSlot.days.wednesday)
                  .map((timeSlot: TimeSlotType) => (
                    <TimeSlot
                      key={timeSlot._id}
                      id={timeSlot._id}
                      top={calculateDistanceFromTop(timeSlot.startTime)}
                      height={calculateHeight(timeSlot.startTime, timeSlot.endTime)}
                      title={timeSlot.title}
                      startTime={timeSlot.startTime}
                      endTime={timeSlot.endTime}
                      location={timeSlot.location}
                      professor={timeSlot.professor}
                      color={timeSlot.color}
                      days={timeSlot.days}
                    />
                  ))
              : !isFetching &&
                data.timeSlots
                  .filter((timeSlot: TimeSlotType) => timeSlot.days.wednesday)
                  .map((timeSlot: TimeSlotType) => (
                    <TimeSlot
                      key={timeSlot._id}
                      id={timeSlot._id}
                      top={calculateDistanceFromTop(timeSlot.startTime)}
                      height={calculateHeight(timeSlot.startTime, timeSlot.endTime)}
                      title={timeSlot.title}
                      startTime={timeSlot.startTime}
                      endTime={timeSlot.endTime}
                      location={timeSlot.location}
                      professor={timeSlot.professor}
                      color={timeSlot.color}
                      days={timeSlot.days}
                    />
                  ))}
          </div>
          <div className="relative mx-2 h-[1008px] w-1/5">
            <h2 className="absolute -inset-8 text-center text-lg font-medium capitalize">
              {window.innerWidth < 535 ? 'th' : 'thursday'}
            </h2>
            {timeSlots
              ? timeSlots
                  .filter((timeSlot: TimeSlotType) => timeSlot.days.thursday)
                  .map((timeSlot: TimeSlotType) => (
                    <TimeSlot
                      key={timeSlot._id}
                      id={timeSlot._id}
                      top={calculateDistanceFromTop(timeSlot.startTime)}
                      height={calculateHeight(timeSlot.startTime, timeSlot.endTime)}
                      title={timeSlot.title}
                      startTime={timeSlot.startTime}
                      endTime={timeSlot.endTime}
                      location={timeSlot.location}
                      professor={timeSlot.professor}
                      color={timeSlot.color}
                      days={timeSlot.days}
                    />
                  ))
              : !isFetching &&
                data.timeSlots
                  .filter((timeSlot: TimeSlotType) => timeSlot.days.thursday)
                  .map((timeSlot: TimeSlotType) => (
                    <TimeSlot
                      key={timeSlot._id}
                      id={timeSlot._id}
                      top={calculateDistanceFromTop(timeSlot.startTime)}
                      height={calculateHeight(timeSlot.startTime, timeSlot.endTime)}
                      title={timeSlot.title}
                      startTime={timeSlot.startTime}
                      endTime={timeSlot.endTime}
                      location={timeSlot.location}
                      professor={timeSlot.professor}
                      color={timeSlot.color}
                      days={timeSlot.days}
                    />
                  ))}
          </div>
          <div className="relative mx-2 h-[1008px] w-1/5">
            <h2 className="absolute -inset-8 text-center text-lg font-medium capitalize">
              {window.innerWidth < 535 ? 'f' : 'friday'}
            </h2>
            {timeSlots
              ? timeSlots
                  .filter((timeSlot: TimeSlotType) => timeSlot.days.friday)
                  .map((timeSlot: TimeSlotType) => (
                    <TimeSlot
                      key={timeSlot._id}
                      id={timeSlot._id}
                      top={calculateDistanceFromTop(timeSlot.startTime)}
                      height={calculateHeight(timeSlot.startTime, timeSlot.endTime)}
                      title={timeSlot.title}
                      startTime={timeSlot.startTime}
                      endTime={timeSlot.endTime}
                      location={timeSlot.location}
                      professor={timeSlot.professor}
                      color={timeSlot.color}
                      days={timeSlot.days}
                    />
                  ))
              : !isFetching &&
                data.timeSlots
                  .filter((timeSlot: TimeSlotType) => timeSlot.days.friday)
                  .map((timeSlot: TimeSlotType) => (
                    <TimeSlot
                      key={timeSlot._id}
                      id={timeSlot._id}
                      top={calculateDistanceFromTop(timeSlot.startTime)}
                      height={calculateHeight(timeSlot.startTime, timeSlot.endTime)}
                      title={timeSlot.title}
                      startTime={timeSlot.startTime}
                      endTime={timeSlot.endTime}
                      location={timeSlot.location}
                      professor={timeSlot.professor}
                      color={timeSlot.color}
                      days={timeSlot.days}
                    />
                  ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ScheduleBox;
