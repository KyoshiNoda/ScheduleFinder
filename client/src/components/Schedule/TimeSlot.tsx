import { useState, useEffect } from 'react';
import { AiFillEdit } from 'react-icons/ai';
import { Modal, Label, Button, Checkbox, TextInput } from 'flowbite-react';
import { colors } from './TimeSlotInput';
import { ToggleSwitch } from 'flowbite-react';
import DaysChecked from './DaysChecked';
import { DaysChecked as DaysCheckedType } from '../../types';

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
};

function TimeSlot(props: Props) {
  const { data, isFetching } = useGetScheduleQuery('schedule', {
    pollingInterval: 900000,
  });
  let days: DaysCheckedType = data[0].timeSlot.filter(
    (element: any) => element._id == props.id
  )[0].days;

  const testHandler = (days: DaysCheckedType) => {
    // console.log(days);
  };
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isTimeSlotClicked, setIsTimeSlotClicked] = useState<boolean>(false);
  const [timeSlotColor, setTimeSlotColor] = useState<string>('border-none');
  const [editMode, setEditMode] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(props.title);

  return (
    <>
      <Modal
        show={isTimeSlotClicked}
        size="5xl"
        popup={true}
        onClose={() => setIsTimeSlotClicked(false)}
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
                    className="w-full rounded-md focus:ring focus:ring-blue-400 focus:ring-opacity-75 dark:border-gray-700 dark:text-gray-900"
                  />
                </div>
              ) : (
                <span>{props.endTime}</span>
              )}
            </div>
            <div className="flex justify-center text-2xl">
              {days.monday && <p>M</p>}
              {days.tuesday && <>T</>}
              {days.wednesday && <>W</>}
              {days.thursday && <>TH</>}
              {days.friday && <>F</>}
            </div>

            {editMode ? <DaysChecked setDays={testHandler} /> : <></>}
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
                      placeholder={props.location!}
                      className="w-full rounded-md focus:ring focus:ring-blue-400 focus:ring-opacity-75 dark:border-gray-700 dark:text-gray-900"
                    />
                  </>
                ) : (
                  <div className="text-2xl">
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
                      className="w-full rounded-md focus:ring focus:ring-blue-400 focus:ring-opacity-75 dark:border-gray-700 dark:text-gray-900"
                    />
                  </>
                ) : (
                  <div className="text-2xl">
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
                      onClick={() => setTimeSlotColor(color)}
                    />
                  ))}
              </div>
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-green-400 px-8 py-3 text-lg font-semibold text-white dark:bg-slate-300 dark:text-black"
            >
              Save
            </button>
            <button
              type="submit"
              className="w-full rounded-full bg-red-400 px-8 py-3 text-lg font-semibold text-white dark:bg-slate-300 dark:text-black"
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
          {isHovering ? (
            <AiFillEdit size={'96'} />
          ) : (
            <>
              <h2 className="text-center font-bold">{props.title}</h2>
              <span>{`${props.startTime} - ${props.endTime}`}</span>
            </>
          )}
        </>
      </div>
    </>
  );
}

export default TimeSlot;