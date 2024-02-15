import { useState, useRef, useEffect } from 'react';
import { AiFillEdit } from 'react-icons/ai';
import { Modal, Select } from 'flowbite-react';
import { colors } from './TimeSlotInput';
import { ToggleSwitch } from 'flowbite-react';
import { DaysChecked as DaysCheckedType, TimeSlot as TimeSlotType } from '../../types';
import { ToastEnum } from '../../enums';
import { useDeleteTimeSlotMutation, useUpdateTimeSlotMutation } from '../../redux/services/schedule/scheduleService';
import { useGetScheduleQuery } from '../../redux/services/auth/authService';
import { useAppSelector } from '../../redux/store';
import DayPicker from './DayPicker';
import { useToast } from '../../utils/functions';

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

const TimeSlot: any = (props: Props) => {
  const { data, isFetching, refetch } = useGetScheduleQuery('schedule', {
    pollingInterval: 900000,
  });

  let scheduleID: string;
  if (!isFetching) {
    scheduleID = data._id;
  }
  const { showToast } = useToast();

  // Check if the time slot is readonly
  const readOnly: boolean = useAppSelector((state: any) => state.globalSlice.readOnly);

  const [deleteTimeSlotMutation] = useDeleteTimeSlotMutation();
  const [updateTimeSlotMutation] = useUpdateTimeSlotMutation();
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isTimeSlotClicked, setIsTimeSlotClicked] = useState<boolean>(false);
  const [timeSlotColor, setTimeSlotColor] = useState<string>('border-none');
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedDays, setSelectedDays] = useState<DaysCheckedType>(props.days);

  // Input Refs
  const titleRef = useRef(document.createElement('input'));
  const startTimeHourRef = useRef(document.createElement('input'));
  const startTimeMinuteRef = useRef(document.createElement('input'));
  const endTimeHourRef = useRef(document.createElement('input'));
  const endTimeMinuteRef = useRef(document.createElement('input'));
  const locationRef = useRef(document.createElement('input'));
  const professorRef = useRef(document.createElement('input'));

  const [width, setWidth] = useState<number>(window.innerWidth);
  const [courseTitle, setCourseTitle] = useState<string>(props.title);

  const [startTimeMeridiem, setStartTimeMeridiem] = useState<string>(props.startTime.slice(-2));
  const [endTimeMeridiem, setEndTimeMeridiem] = useState<string>(props.endTime.slice(-2));

  // cuts the titles into shorter length for smaller screens
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    if (width < 450) {
      const newTitle = props.title.slice(0, 6);
      setCourseTitle(newTitle);
    }
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [width]);

  // populate input values in editModal modal
  useEffect(() => {
    const startTimeOnly = props.startTime.slice(0, -3);
    const startTime = startTimeOnly.split(':');
    const startHour = startTime[0];
    const startMin = startTime[1].trim();

    const endTimeOnly = props.endTime.slice(0, -3);
    const endTime = endTimeOnly.split(':');
    const endHour = endTime[0];
    const endMin = endTime[1].trim();

    if (titleRef.current) titleRef.current.value = props.title;
    if (startTimeHourRef.current) startTimeHourRef.current.value = startHour;
    if (startTimeMinuteRef.current) startTimeMinuteRef.current.value = startMin;
    if (endTimeHourRef.current) endTimeHourRef.current.value = endHour;
    if (endTimeMinuteRef.current) endTimeMinuteRef.current.value = endMin;
    if (locationRef.current) locationRef.current.value = props.location || '';
    if (professorRef.current) professorRef.current.value = props.professor || '';
  }, [editMode]);

  useEffect(() => {
    setTimeSlotColor(props.color);
  }, []);

  const handleStartTimeMeridiemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStartTimeMeridiem(e.target.value);

    if (e.target.value === 'PM') {
      setEndTimeMeridiem('PM');
    }
  };

  const saveHandler = async () => {
    const startTime = startTimeHourRef.current.value + ':' + startTimeMinuteRef.current.value + ' ' + startTimeMeridiem;
    const endTime = endTimeHourRef.current.value + ':' + endTimeMinuteRef.current.value + ' ' + endTimeMeridiem;

    const updatedTimeSlot: TimeSlotType = {
      _id: props.id!,
      title: titleRef.current.value,
      startTime: startTime,
      endTime: endTime,
      color: timeSlotColor,
      professor: professorRef.current.value,
      location: locationRef.current.value,
      days: props.days,
    };

    const { monday, tuesday, wednesday, thursday, friday } = selectedDays;

    if (!(monday || tuesday || wednesday || thursday || friday)) {
      try {
        await updateTimeSlotMutation({
          scheduleId: scheduleID,
          timeSlot: updatedTimeSlot,
        });
        showToast(ToastEnum.UPDATE_TIMESLOT);
      } catch (error) {
        console.log(error);
      }
    } else {
      const daySelection = {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
      };

      if (monday) daySelection.monday = true;
      if (tuesday) daySelection.tuesday = true;
      if (wednesday) daySelection.wednesday = true;
      if (thursday) daySelection.thursday = true;
      if (friday) daySelection.friday = true;

      updatedTimeSlot.days = daySelection;
      updatedTimeSlot.color = timeSlotColor;
      try {
        await updateTimeSlotMutation({
          scheduleId: scheduleID,
          timeSlot: updatedTimeSlot,
        });
        showToast(ToastEnum.UPDATE_TIMESLOT);
      } catch (error) {
        console.log(error);
      }
    }
    setEditMode(false);
    setIsTimeSlotClicked(false);
  };

  const deleteHandler = async () => {
    setEditMode(false);
    setIsTimeSlotClicked(false);
    try {
      await deleteTimeSlotMutation({
        scheduleId: scheduleID,
        timeSlot: { _id: props.id! },
      });
      showToast(ToastEnum.DELETED_TIMESLOT);
    } catch (error) {
      console.log(error);
    }
  };
  const handleColorPickerKeyPress = (e: React.KeyboardEvent<HTMLDivElement>, color: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setTimeSlotColor(color);
    }
  };

  return (
    <>
      <Modal
        show={isTimeSlotClicked}
        size="5xl"
        popup={true}
        onClose={() => {
          setIsTimeSlotClicked(false);
          setEditMode(false);
        }}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="flex flex-col gap-4">
            <ToggleSwitch checked={editMode} label="Edit Mode" onChange={() => setEditMode(!editMode)} />
            <div className="flex justify-center">
              {editMode ? (
                <div className="w-full sm:w-1/2">
                  <label htmlFor="title" className="text-3xl dark:text-white">
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    ref={titleRef}
                    className="w-full rounded-md focus:ring focus:ring-blue-400 focus:ring-opacity-75 dark:border-gray-700 dark:text-gray-900"
                  />
                </div>
              ) : (
                <h1 className="text-center text-5xl font-medium text-gray-900 dark:text-white">{props.title}</h1>
              )}
            </div>
            <div className="flex flex-col items-center justify-center dark:text-white sm:text-4xl">
              {editMode && (
                <>
                  <label htmlFor="startTime" className="self-start text-xl lg:ml-60 lg:text-2xl">
                    Start Time
                  </label>
                  <div className="mx-1 flex gap-3 lg:w-1/2">
                    <div>
                      <input
                        id="startTime"
                        type="number"
                        ref={startTimeHourRef}
                        defaultValue={startTimeHourRef.current ? startTimeHourRef.current.value : ''}
                        className="w-full rounded-md focus:ring focus:ring-blue-400 focus:ring-opacity-75 dark:border-gray-700 dark:text-gray-900"
                      />
                    </div>
                    <span className="flex items-center text-lg">:</span>
                    <div>
                      <input
                        id="startTime"
                        type="number"
                        ref={startTimeMinuteRef}
                        defaultValue={startTimeMinuteRef.current ? startTimeMinuteRef.current.value : ''}
                        className="w-full rounded-md focus:ring focus:ring-blue-400 focus:ring-opacity-75 dark:border-gray-700 dark:text-gray-900"
                      />
                    </div>
                    <div className="flex w-full items-end">
                      <Select
                        value={startTimeMeridiem}
                        onChange={(e) => handleStartTimeMeridiemChange(e)}
                        id="startMeridiemTime"
                        className="w-3/4"
                        required
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </Select>
                    </div>
                  </div>
                </>
              )}

              {editMode && (
                <>
                  <label htmlFor="endTime" className="self-start text-xl lg:ml-60 lg:text-2xl">
                    End Time
                  </label>
                  <div className="mx-1 flex gap-3 lg:w-1/2">
                    <div>
                      <input
                        id="endTime"
                        type="number"
                        ref={endTimeHourRef}
                        defaultValue={endTimeHourRef.current ? endTimeHourRef.current.value : ''}
                        className="w-full rounded-md focus:ring focus:ring-blue-400 focus:ring-opacity-75 dark:border-gray-700 dark:text-gray-900"
                      />
                    </div>
                    <span className="flex items-center text-lg">:</span>
                    <div>
                      <input
                        id="endTime"
                        type="number"
                        ref={endTimeMinuteRef}
                        defaultValue={endTimeMinuteRef.current ? endTimeMinuteRef.current.value : ''}
                        className="w-full rounded-md focus:ring focus:ring-blue-400 focus:ring-opacity-75 dark:border-gray-700 dark:text-gray-900"
                      />
                    </div>
                    <div className="flex w-full items-end">
                      <Select
                        value={endTimeMeridiem}
                        onChange={(e) => handleStartTimeMeridiemChange(e)}
                        id="endTimeMeridiem"
                        className="w-3/4"
                        required
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </Select>
                    </div>
                  </div>
                </>
              )}
              {!editMode && (
                <div className="flex">
                  <span className="text-2xl">{props.startTime} - </span>
                  <span className="text-2xl">{props.endTime}</span>
                </div>
              )}
            </div>

            {editMode ? (
              <DayPicker selectedDays={selectedDays} setSelectedDays={setSelectedDays} />
            ) : (
              <div className="flex justify-center gap-3 text-2xl dark:text-white">
                <span className="font-semibold">Days:</span>
                <span>{selectedDays?.monday && 'M'}</span>
                <span>{selectedDays?.tuesday && 'T'}</span>
                <span>{selectedDays?.wednesday && 'W'}</span>
                <span>{selectedDays?.thursday && 'TH'}</span>
                <span>{selectedDays?.friday && 'F'}</span>
              </div>
            )}
            <div className="flex flex-col items-center justify-evenly sm:flex-row">
              <div>
                {editMode ? (
                  <>
                    <label htmlFor="location" className="text-sm dark:text-white">
                      Location
                    </label>
                    <input
                      id="location"
                      type="text"
                      ref={locationRef}
                      placeholder="Enter location"
                      className="w-full rounded-md focus:ring focus:ring-blue-400 focus:ring-opacity-75 dark:border-gray-700 dark:text-gray-900"
                    />
                  </>
                ) : (
                  <div className="space-x-2 text-2xl dark:text-white">
                    <span className="font-semibold">Location:</span>
                    <span className="capitalize">{props.location ? props.location : 'N/A'}</span>
                  </div>
                )}
              </div>
              <div>
                {editMode ? (
                  <>
                    <label htmlFor="professor" className="text-sm dark:text-white">
                      Professor
                    </label>
                    <input
                      id="professor"
                      type="text"
                      placeholder="Enter professor's name"
                      ref={professorRef}
                      className="w-full rounded-md focus:ring focus:ring-blue-400 focus:ring-opacity-75 dark:border-gray-700 dark:text-gray-900"
                    />
                  </>
                ) : (
                  <div className="space-x-2 text-2xl dark:text-white">
                    <span className="font-semibold">Professor:</span>
                    <span className="capitalize">{props.professor ? props.professor : 'N/A'}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center">
              <div className="my-2 grid grid-cols-7 gap-2">
                {editMode &&
                  colors.map((color) => (
                    <div
                      id="colorPicker"
                      tabIndex={0}
                      onKeyDown={(e) => handleColorPickerKeyPress(e, color)}
                      key={color}
                      className={`bg-${color}-400 h-7 w-7 cursor-pointer rounded-full border-4 p-1 sm:h-10 sm:w-10 ${timeSlotColor === color ? 'border-blue-700' : 'border-none'
                        }`}
                      onClick={() => {
                        setTimeSlotColor((prevColor) => (prevColor === color ? '' : color));
                      }}
                    />
                  ))}
              </div>
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-green-400 px-8 py-3 text-lg font-semibold text-white hover:bg-green-600 dark:bg-green-700 dark:text-white hover:dark:bg-green-800"
              onClick={saveHandler}
            >
              Save
            </button>
            <button
              type="submit"
              className="w-full rounded-full bg-red-500 px-8 py-3 text-lg font-semibold text-white hover:bg-red-700 dark:bg-rose-600 dark:text-white hover:dark:bg-rose-800"
              onClick={deleteHandler}
            >
              Delete
            </button>
          </div>
        </Modal.Body>
      </Modal>
      <div
        className={`absolute flex flex-col items-center justify-start gap-1 rounded-lg p-3 text-xs bg-${props.color}-400 w-full ${!readOnly && 'overflow-hidden hover:cursor-pointer hover:brightness-50'
          } dark:text-black`}
        style={{ top: `${props.top}px`, height: `${props.height}px` }}
        onClick={() => setIsTimeSlotClicked(readOnly ? false : true)}
        onMouseEnter={() => setIsHovering(readOnly ? false : true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {isHovering && <AiFillEdit size={'96'} />}
        {parseInt(props.height) > 55 && (
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-center font-bold">{courseTitle}</h2>
            <span className="invisible md:visible">{`${props.startTime} - ${props.endTime}`}</span>
          </div>
        )}
      </div>
    </>
  );
};

export default TimeSlot;
