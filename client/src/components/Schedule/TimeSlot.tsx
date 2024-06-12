import { useState } from 'react';
import { DaysChecked as DaysCheckedType } from '../../types';
import { useGetScheduleQuery } from '../../redux/services/auth/authService';
import { useAppSelector } from '../../redux/store';
import EditTimeSlotModal from '../Modals/EditTimeSlotModal';

type Props = {
  id?: undefined | string;
  top: string;
  height: string;
  title: string;
  startTime: string;
  endTime: string;
  location?: string | null;
  professor?: string | null;
  color: string;
  days: DaysCheckedType;
};

const TimeSlot = (props: Props) => {
  const { data, isFetching } = useGetScheduleQuery('schedule', {
    pollingInterval: 900000,
  });

  const readOnly: boolean = useAppSelector((state: any) => state.globalSlice.readOnly);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isTimeSlotClicked, setIsTimeSlotClicked] = useState<boolean>(false);
  const [courseTitle, setCourseTitle] = useState<string>(props.title);
  const [timeSlotColor, setTimeSlotColor] = useState<string>(props.color);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedDays, setSelectedDays] = useState<DaysCheckedType>(props.days);
  const [startTimeMeridiem, setStartTimeMeridiem] = useState<string>(props.startTime.slice(-2));
  const [endTimeMeridiem, setEndTimeMeridiem] = useState<string>(props.endTime.slice(-2));

  return (
    <>
      <div
        className={`absolute z-20 flex flex-col items-center justify-start gap-1 rounded-lg p-3 text-xs bg-${
          props.color
        }-400 w-full ${
          !readOnly && 'overflow-hidden hover:cursor-pointer hover:brightness-50'
        } dark:text-black`}
        style={{ top: `${props.top}px`, height: `${props.height}px` }}
        onClick={() => setIsTimeSlotClicked(readOnly ? false : true)}
        onMouseEnter={() => setIsHovering(readOnly ? false : true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {parseInt(props.height) > 55 && (
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-center font-bold">{courseTitle}</h2>
            <span className="invisible md:visible">{`${props.startTime} - ${props.endTime}`}</span>
          </div>
        )}
      </div>
      {!isFetching && data && (
        <EditTimeSlotModal
          isTimeSlotClicked={isTimeSlotClicked}
          setIsTimeSlotClicked={setIsTimeSlotClicked}
          courseTitle={courseTitle}
          setCourseTitle={setCourseTitle}
          timeSlotColor={timeSlotColor}
          setTimeSlotColor={setTimeSlotColor}
          editMode={editMode}
          setEditMode={setEditMode}
          selectedDays={selectedDays}
          setSelectedDays={setSelectedDays}
          startTimeMeridiem={startTimeMeridiem}
          setStartTimeMeridiem={setStartTimeMeridiem}
          endTimeMeridiem={endTimeMeridiem}
          setEndTimeMeridiem={setEndTimeMeridiem}
          startTime={props.startTime}
          endTime={props.endTime}
          location={props.location}
          professor={props.professor}
          id={props.id}
          scheduleID={data._id}
        />
      )}
    </>
  );
};

export default TimeSlot;
