import { TimeSlot as TimeSlotType } from '../../types';
import TimeSlot from './TimeSlot';
import { useGetScheduleQuery } from '../../redux/services/schedule/scheduleService';

type Props = {
  timeSlots: TimeSlotType[] | undefined;
};

function ScheduleBox({}: Props) {
  const { data, isFetching } = useGetScheduleQuery('schedule', {
    pollingInterval: 900000,
  });

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

  const calculateHeight = (startTime: string, endTime: string) => {
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

  const calculateDistanceFromTop = (startTime: string) => {
    const minutes: number = calculateMinutesFromTop(startTime);
    const distanceFromTop: number = (minutes * 72) / 60;
    return distanceFromTop.toString();
  };

  return (
    <>
      <div className="flex w-full flex-col">
        <div className="relative mb-6 flex h-[1008px] rounded bg-white dark:bg-black dark:text-white">
          <span className="absolute top-[-11px] -left-5">7</span>
          <span className="absolute top-[61px] -left-5">8</span>
          <span className="absolute top-[133px] -left-5">9</span>
          <span className="absolute top-[205px] -left-6">10</span>
          <span className="absolute top-[277px] -left-6">11</span>
          <span className="absolute top-[349px] -left-6">12</span>
          <span className="absolute top-[421px] -left-5">1</span>
          <span className="absolute top-[493px] -left-5">2</span>
          <span className="absolute top-[565px] -left-5">3</span>
          <span className="absolute top-[637px] -left-5">4</span>
          <span className="absolute top-[709px] -left-5">5</span>
          <span className="absolute top-[781px] -left-5">6</span>
          <span className="absolute top-[853px] -left-5">7</span>
          <span className="absolute top-[925px] -left-5">8</span>
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
              monday
            </h2>
            {!isFetching &&
              data[0].timeSlot
                .filter((timeSlot: TimeSlotType) => timeSlot.days.monday)
                .map((timeSlot: TimeSlotType) => (
                  <TimeSlot
                    key={timeSlot._id}
                    id={timeSlot._id}
                    top={calculateDistanceFromTop(timeSlot.startTime)}
                    height={calculateHeight(
                      timeSlot.startTime,
                      timeSlot.endTime
                    )}
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
              tuesday
            </h2>
            {!isFetching &&
              data[0].timeSlot
                .filter((timeSlot: TimeSlotType) => timeSlot.days.tuesday)
                .map((timeSlot: TimeSlotType) => (
                  <TimeSlot
                    key={timeSlot._id}
                    id={timeSlot._id}
                    top={calculateDistanceFromTop(timeSlot.startTime)}
                    height={calculateHeight(
                      timeSlot.startTime,
                      timeSlot.endTime
                    )}
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
              wednesday
            </h2>
            {!isFetching &&
              data[0].timeSlot
                .filter((timeSlot: TimeSlotType) => timeSlot.days.wednesday)
                .map((timeSlot: TimeSlotType) => (
                  <TimeSlot
                    key={timeSlot._id}
                    id={timeSlot._id}
                    top={calculateDistanceFromTop(timeSlot.startTime)}
                    height={calculateHeight(
                      timeSlot.startTime,
                      timeSlot.endTime
                    )}
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
              thursday
            </h2>
            {!isFetching &&
              data[0].timeSlot
                .filter((timeSlot: TimeSlotType) => timeSlot.days.thursday)
                .map((timeSlot: TimeSlotType) => (
                  <TimeSlot
                    key={timeSlot._id}
                    id={timeSlot._id}
                    top={calculateDistanceFromTop(timeSlot.startTime)}
                    height={calculateHeight(
                      timeSlot.startTime,
                      timeSlot.endTime
                    )}
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
              friday
            </h2>
            {!isFetching &&
              data[0].timeSlot
                .filter((timeSlot: TimeSlotType) => timeSlot.days.friday)
                .map((timeSlot: TimeSlotType) => (
                  <TimeSlot
                    key={timeSlot._id}
                    id={timeSlot._id}
                    top={calculateDistanceFromTop(timeSlot.startTime)}
                    height={calculateHeight(
                      timeSlot.startTime,
                      timeSlot.endTime
                    )}
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
}

export default ScheduleBox;
