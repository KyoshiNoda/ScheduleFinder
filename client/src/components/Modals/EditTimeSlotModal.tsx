import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import {
  useUpdateTimeSlotMutation,
  useDeleteTimeSlotMutation,
} from '../../redux/services/schedule/scheduleService';
import { Modal, Select, ToggleSwitch } from 'flowbite-react';
import { useToast } from '../../utils/functions';
import { DaysChecked as DaysCheckedType, TimeSlot as TimeSlotType } from '../../types';
import { ToastEnum } from '../../enums';
import DayPicker from '../Schedule/DayPicker';
import { colors } from '../Schedule/TimeSlotInput';
import { useEscapeKey } from '../../utils/functions';
import { FaTrashAlt } from 'react-icons/fa';

type EditTimeSlotModalProps = {
  isTimeSlotClicked: boolean;
  setIsTimeSlotClicked: Dispatch<SetStateAction<boolean>>;
  courseTitle: string;
  setCourseTitle: Dispatch<SetStateAction<string>>;
  timeSlotColor: string;
  setTimeSlotColor: Dispatch<SetStateAction<string>>;
  editMode: boolean;
  setEditMode: Dispatch<SetStateAction<boolean>>;
  selectedDays: DaysCheckedType;
  setSelectedDays: Dispatch<SetStateAction<DaysCheckedType>>;
  startTimeMeridiem: string;
  setStartTimeMeridiem: Dispatch<SetStateAction<string>>;
  endTimeMeridiem: string;
  setEndTimeMeridiem: Dispatch<SetStateAction<string>>;
  startTime: string;
  endTime: string;
  location?: string | null;
  professor?: string | null;
  id?: string;
  scheduleID?: string;
};

const EditTimeSlotModal = ({
  isTimeSlotClicked,
  setIsTimeSlotClicked,
  courseTitle,
  timeSlotColor,
  setTimeSlotColor,
  editMode,
  setEditMode,
  selectedDays,
  setSelectedDays,
  startTimeMeridiem,
  setStartTimeMeridiem,
  endTimeMeridiem,
  setEndTimeMeridiem,
  startTime,
  endTime,
  location,
  professor,
  id,
  scheduleID,
}: EditTimeSlotModalProps) => {
  const titleRef = useRef(document.createElement('input'));
  const startTimeHourRef = useRef(document.createElement('input'));
  const startTimeMinuteRef = useRef(document.createElement('input'));
  const endTimeHourRef = useRef(document.createElement('input'));
  const endTimeMinuteRef = useRef(document.createElement('input'));
  const locationRef = useRef(document.createElement('input'));
  const professorRef = useRef(document.createElement('input'));

  const [deleteTimeSlotMutation] = useDeleteTimeSlotMutation();
  const [updateTimeSlotMutation] = useUpdateTimeSlotMutation();

  const { showToast } = useToast();

  useEffect(() => {
    const startTimeOnly = startTime.slice(0, -3);
    const startTimeArr = startTimeOnly.split(':');
    const startHour = startTimeArr[0];
    const startMin = startTimeArr[1].trim();

    const endTimeOnly = endTime.slice(0, -3);
    const endTimeArr = endTimeOnly.split(':');
    const endHour = endTimeArr[0];
    const endMin = endTimeArr[1].trim();

    if (titleRef.current) titleRef.current.value = courseTitle;
    if (startTimeHourRef.current) startTimeHourRef.current.value = startHour;
    if (startTimeMinuteRef.current) startTimeMinuteRef.current.value = startMin;
    if (endTimeHourRef.current) endTimeHourRef.current.value = endHour;
    if (endTimeMinuteRef.current) endTimeMinuteRef.current.value = endMin;
    if (locationRef.current) locationRef.current.value = location || '';
    if (professorRef.current) professorRef.current.value = professor || '';
  }, [editMode]);

  const handleStartTimeMeridiemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStartTimeMeridiem(e.target.value);

    if (e.target.value === 'PM') {
      setEndTimeMeridiem('PM');
    }
  };

  const saveHandler = async () => {
    const startTime =
      startTimeHourRef.current.value +
      ':' +
      startTimeMinuteRef.current.value +
      ' ' +
      startTimeMeridiem;
    const endTime =
      endTimeHourRef.current.value + ':' + endTimeMinuteRef.current.value + ' ' + endTimeMeridiem;

    const updatedTimeSlot: TimeSlotType = {
      _id: id!,
      title: titleRef.current.value,
      startTime: startTime,
      endTime: endTime,
      color: timeSlotColor,
      professor: professorRef.current.value,
      location: locationRef.current.value,
      days: selectedDays,
    };

    try {
      await updateTimeSlotMutation({
        scheduleId: scheduleID!,
        timeSlot: updatedTimeSlot,
      });
      showToast(ToastEnum.UPDATE_TIMESLOT);
    } catch (error) {
      console.log(error);
    }
    setEditMode(false);
    setIsTimeSlotClicked(false);
  };

  const deleteHandler = async () => {
    setEditMode(false);
    setIsTimeSlotClicked(false);
    try {
      await deleteTimeSlotMutation({
        scheduleId: scheduleID!,
        timeSlot: { _id: id! },
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
  useEscapeKey(() => setIsTimeSlotClicked(false));

  return (
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
              <h1 className="text-center text-5xl font-medium text-gray-900 dark:text-white">
                {courseTitle}
              </h1>
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
                      className="w-full rounded-md focus:ring focus:ring-blue-400 focus:ring-opacity-75 dark:border-gray-700 dark:text-gray-900"
                    />
                  </div>
                  <span className="flex items-center text-lg">:</span>
                  <div>
                    <input
                      id="startTime"
                      type="number"
                      ref={startTimeMinuteRef}
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
                      className="w-full rounded-md focus:ring focus:ring-blue-400 focus:ring-opacity-75 dark:border-gray-700 dark:text-gray-900"
                    />
                  </div>
                  <span className="flex items-center text-lg">:</span>
                  <div>
                    <input
                      id="endTime"
                      type="number"
                      ref={endTimeMinuteRef}
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
              <div className="flex gap-2">
                <span className="text-2xl">{startTime} - </span>
                <span className="text-2xl">{endTime}</span>
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
                  <span className="capitalize">{location ? location : 'N/A'}</span>
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
                  <span className="capitalize">{professor ? professor : 'N/A'}</span>
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
                    className={`bg-${color}-400 h-7 w-7 cursor-pointer rounded-full border-4 p-1 sm:h-10 sm:w-10 ${
                      timeSlotColor === color ? 'border-blue-700' : 'border-none'
                    }`}
                    onClick={() => {
                      setTimeSlotColor((prevColor) => (prevColor === color ? '' : color));
                    }}
                  />
                ))}
            </div>
          </div>
          <div className="flex gap-3">
            {editMode && (
              <button
                type="submit"
                className="w-full rounded-lg bg-green-400 px-8 py-3 text-xl font-semibold text-white hover:bg-green-600 dark:bg-green-700 dark:text-white hover:dark:bg-green-800"
                onClick={saveHandler}
              >
                Save
              </button>
            )}
            <button
              type="submit"
              className="w-full rounded-lg bg-red-500 px-8 py-3 text-xl font-semibold text-white hover:bg-red-700 dark:bg-rose-600 dark:text-white hover:dark:bg-rose-800"
              onClick={deleteHandler}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EditTimeSlotModal;
