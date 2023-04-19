import { useState, useRef, useEffect } from 'react';
import { AiFillEdit } from 'react-icons/ai';
import { Modal } from 'flowbite-react';
import { colors } from './TimeSlotInput';
import { ToggleSwitch } from 'flowbite-react';
import {
  DaysChecked as DaysCheckedType,
  TimeSlot as TimeSlotType,
} from '../../types';
import {
  useDeleteTimeSlotMutation,
  useUpdateTimeSlotMutation,
} from '../../redux/services/schedule/scheduleService';
import { useGetScheduleQuery } from '../../redux/services/auth/authService';

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

function TimeSlot(props: Props) {
  const { data, isFetching, refetch } = useGetScheduleQuery('schedule', {
    pollingInterval: 900000,
  });

  let scheduleID: string;
  if (!isFetching) {
    scheduleID = data[0]._id;
  }

  const [deleteTimeSlotMutation] = useDeleteTimeSlotMutation();
  const [updateTimeSlotMutation] = useUpdateTimeSlotMutation();
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isTimeSlotClicked, setIsTimeSlotClicked] = useState<boolean>(false);
  const [timeSlotColor, setTimeSlotColor] = useState<string>('border-none');
  const [editMode, setEditMode] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(props.title);
  const [startTime, setStartTime] = useState<string>(props.startTime);
  const [endTime, setEndTime] = useState<string>(props.endTime);
  const [days, setDays] = useState<DaysCheckedType>(props.days);
  const mondayRef = useRef(document.createElement('input'));
  const tuesdayRef = useRef(document.createElement('input'));
  const wednesdayRef = useRef(document.createElement('input'));
  const thursdayRef = useRef(document.createElement('input'));
  const fridayRef = useRef(document.createElement('input'));

  const [location, setLocation] = useState<string | null>(
    props.location ?? null
  );
  const [professor, setProfessor] = useState<string | null>(
    props.professor ?? null
  );
  useEffect(() => {
    setTimeSlotColor(props.color);
  }, []);

  const saveHandler = async () => {
    const updatedTimeSlot: TimeSlotType = {
      _id: props.id!,
      title: title,
      startTime: startTime,
      endTime: endTime,
      color: timeSlotColor,
      professor: professor,
      location: location,
      days: props.days,
    };
    if (
      !(
        mondayRef.current.checked ||
        tuesdayRef.current.checked ||
        wednesdayRef.current.checked ||
        thursdayRef.current.checked ||
        fridayRef.current.checked
      )
    ) {
      try {
        await updateTimeSlotMutation({
          scheduleId: scheduleID,
          timeSlot: updatedTimeSlot,
        });
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

      if (mondayRef.current.checked) daySelection.monday = true;
      if (tuesdayRef.current.checked) daySelection.tuesday = true;
      if (wednesdayRef.current.checked) daySelection.wednesday = true;
      if (thursdayRef.current.checked) daySelection.thursday = true;
      if (fridayRef.current.checked) daySelection.friday = true;

      updatedTimeSlot.days = daySelection;
      updatedTimeSlot.color = timeSlotColor;
      try {
        await updateTimeSlotMutation({
          scheduleId: scheduleID,
          timeSlot: updatedTimeSlot,
        });
      } catch (error) {
        console.log(error);
      }
    }
    setEditMode(false);
    setIsTimeSlotClicked(false);
    window.location.reload();
  };

  const deleteHandler = async () => {
    setEditMode(false);
    setIsTimeSlotClicked(false);
    try {
      await deleteTimeSlotMutation({
        scheduleId: scheduleID,
        timeSlot: { _id: props.id! },
      });
      refetch();
    } catch (error) {
      console.log(error); // handle errors here
    }
    window.location.reload();
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
            <ToggleSwitch
              checked={editMode}
              label="Edit Mode"
              onChange={() => setEditMode(!editMode)}
            />
            <div className="flex justify-center">
              {editMode ? (
                <div className="w-1/2">
                  <label htmlFor="title" className="text-3xl">
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    placeholder={props.title}
                    onBlur={(event) => setTitle(event.target.value)}
                    className="w-full rounded-md focus:ring focus:ring-blue-400 focus:ring-opacity-75 dark:border-gray-700 dark:text-gray-900"
                  />
                </div>
              ) : (
                <h1 className="text-5xl font-medium text-gray-900 dark:text-white">
                  {props.title}
                </h1>
              )}
            </div>
            <div className="flex items-center justify-center text-4xl dark:text-white">
              {editMode ? (
                <div className="w-1/6">
                  <label htmlFor="startTime" className="text-2xl">
                    Start Time
                  </label>
                  <input
                    id="startTime"
                    type="text"
                    placeholder={props.startTime}
                    onBlur={(event) => setStartTime(event.target.value)}
                    className="w-full rounded-md focus:ring focus:ring-blue-400 focus:ring-opacity-75 dark:border-gray-700 dark:text-gray-900"
                  />
                </div>
              ) : (
                <span>{props.startTime}</span>
              )}

              {!editMode && <>-</>}

              {editMode ? (
                <div className="w-1/6">
                  <label htmlFor="endTime" className="text-2xl">
                    End Time
                  </label>
                  <input
                    id="endTime"
                    type="text"
                    placeholder={props.endTime}
                    onBlur={(event) => setEndTime(event.target.value)}
                    className="w-full rounded-md focus:ring focus:ring-blue-400 focus:ring-opacity-75 dark:border-gray-700 dark:text-gray-900"
                  />
                </div>
              ) : (
                <span>{props.endTime}</span>
              )}
            </div>

            {editMode ? (
              <ul className="w-full items-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:flex">
                <li className="w-full border-b border-gray-200 dark:border-gray-600 sm:border-b-0 sm:border-r">
                  <div className="flex items-center pl-3">
                    <input
                      ref={mondayRef}
                      id="monday"
                      type="checkbox"
                      value="monday"
                      className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
                    />
                    <label
                      htmlFor="monday"
                      className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Mon
                    </label>
                  </div>
                </li>
                <li className="w-full border-b border-gray-200 dark:border-gray-600 sm:border-b-0 sm:border-r">
                  <div className="flex items-center pl-3">
                    <input
                      ref={tuesdayRef}
                      id="tuesday"
                      type="checkbox"
                      value="tuesday"
                      className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
                    />
                    <label
                      htmlFor="tuesday"
                      className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Tues
                    </label>
                  </div>
                </li>
                <li className="w-full border-b border-gray-200 dark:border-gray-600 sm:border-b-0 sm:border-r">
                  <div className="flex items-center pl-3">
                    <input
                      ref={wednesdayRef}
                      id="wednesday"
                      type="checkbox"
                      value="wednesday"
                      className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
                    />
                    <label
                      htmlFor="wednesday"
                      className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Wed
                    </label>
                  </div>
                </li>
                <li className="w-full dark:border-gray-600">
                  <div className="flex items-center pl-3">
                    <input
                      ref={thursdayRef}
                      id="thursday"
                      type="checkbox"
                      value="thursday"
                      className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
                    />
                    <label
                      htmlFor="thursday"
                      className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Thurs
                    </label>
                  </div>
                </li>
                <li className="w-full dark:border-gray-600">
                  <div className="flex items-center pl-3">
                    <input
                      ref={fridayRef}
                      id="friday"
                      type="checkbox"
                      value="friday"
                      className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
                    />
                    <label
                      htmlFor="friday"
                      className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Fri
                    </label>
                  </div>
                </li>
              </ul>
            ) : (
              <div className="flex justify-center gap-3 text-2xl dark:text-white">
                <div>Days:</div>
                <div>{days?.monday && <>M</>}</div>
                <div>{days?.tuesday && <>T</>}</div>
                <div>{days?.wednesday && <>W</>}</div>
                <div>{days?.thursday && <>TH</>}</div>
                <div>{days?.friday && <>F</>}</div>
              </div>
            )}
            <div className="flex justify-evenly">
              <div>
                {editMode ? (
                  <>
                    <label htmlFor="location" className="text-sm">
                      Location
                    </label>
                    <input
                      id="location"
                      type="text"
                      onBlur={(event) => setLocation(event.target.value)}
                      placeholder={props.location!}
                      className="w-full rounded-md focus:ring focus:ring-blue-400 focus:ring-opacity-75 dark:border-gray-700 dark:text-gray-900"
                    />
                  </>
                ) : (
                  <div className="text-2xl dark:text-white">
                    <p>Location:</p>
                    <span>
                      {props.location === null ? <>null</> : props.location}
                    </span>
                  </div>
                )}
              </div>
              <div>
                {editMode ? (
                  <>
                    <label htmlFor="professor" className="text-sm">
                      Professor
                    </label>
                    <input
                      id="professor"
                      type="text"
                      placeholder={props.professor!}
                      onBlur={(event) => setProfessor(event.target.value)}
                      className="w-full rounded-md focus:ring focus:ring-blue-400 focus:ring-opacity-75 dark:border-gray-700 dark:text-gray-900"
                    />
                  </>
                ) : (
                  <div className="text-2xl dark:text-white">
                    <p>Professor:</p>
                    <span>
                      {props.professor === null ? <>null</> : props.professor}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center">
              <div className="grid w-1/3 grid-cols-7 grid-rows-2 gap-2 p-2">
                {editMode &&
                  colors.map((color) => (
                    <div
                      key={color}
                      className={`bg-${color}-400 h-10 w-10 cursor-pointer rounded-full border-4 p-1 ${
                        timeSlotColor === color
                          ? 'border-blue-700'
                          : 'border-none'
                      }`}
                      onClick={() => {
                        setTimeSlotColor((prevColor) =>
                          prevColor === color ? '' : color
                        );
                      }}
                    />
                  ))}
              </div>
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-green-400 px-8 py-3 text-lg font-semibold text-white dark:bg-green-700 dark:text-white"
              onClick={saveHandler}
            >
              Save
            </button>
            <button
              type="submit"
              className="w-full rounded-full bg-red-500 px-8 py-3 text-lg font-semibold text-white  dark:bg-rose-700 dark:text-white"
              onClick={deleteHandler}
            >
              Delete
            </button>
          </div>
        </Modal.Body>
      </Modal>
      <div
        className={`absolute flex flex-col items-center justify-start gap-1 rounded-lg p-3 text-xs bg-${props.color}-400 w-full hover:cursor-pointer hover:brightness-50 dark:text-black`}
        style={{ top: `${props.top}px`, height: `${props.height}px` }}
        onClick={() => setIsTimeSlotClicked(true)}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <>
          {isHovering && <AiFillEdit size={'96'} />}
          {parseInt(props.height) > 55 && (
            <div>
              <h2 className="text-center font-bold">{props.title}</h2>
              <span>{`${props.startTime} - ${props.endTime}`}</span>
            </div>
          )}
        </>
      </div>
    </>
  );
}

export default TimeSlot;
