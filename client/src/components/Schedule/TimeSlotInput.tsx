import { useState, useRef } from 'react';
import { useGetScheduleQuery } from '../../redux/services/auth/authService';
type days = {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
};

type TimeSlot = {
  _id: string;
  days: days;
  title: string;
  startTime: string;
  endTime: string;
  location: string | null;
  professor: string | null;
  color: string;
};

type Props = {
  setTimeSlots: React.Dispatch<React.SetStateAction<TimeSlot[]>>;
};

const formActions = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
};

const colors: string[] = [
  'slate',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'blue',
  'violet',
  'purple',
  'fuchsia',
  'rose',
];

function TimeSlotInput({ setTimeSlots }: Props) {
  const formRef = useRef(document.createElement('form'));
  const titleRef = useRef(document.createElement('input'));
  const mondayRef = useRef(document.createElement('input'));
  const tuesdayRef = useRef(document.createElement('input'));
  const wednesdayRef = useRef(document.createElement('input'));
  const thursdayRef = useRef(document.createElement('input'));
  const fridayRef = useRef(document.createElement('input'));
  const startTimeRef = useRef(document.createElement('input'));
  const endTimeRef = useRef(document.createElement('input'));
  const locationRef = useRef(document.createElement('input'));
  const professorRef = useRef(document.createElement('input'));
  const [timeSlotColor, setTimeSlotColor] = useState<string>('slate');
  const { data, isFetching } = useGetScheduleQuery('schedule', {
    pollingInterval: 900000,
  });
  if(!isFetching && data){
    const [schedule] = data;
    console.log(schedule)
  }

  const addTimeSlot = (e: React.FormEvent<HTMLFormElement>) => {
    // If no checkboxes have been selected, the form shouldn't be submitted.
    if (
      !(
        mondayRef.current.checked ||
        tuesdayRef.current.checked ||
        wednesdayRef.current.checked ||
        thursdayRef.current.checked ||
        fridayRef.current.checked
      )
    )
      return;

    const daySelection = {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
    };

    if (mondayRef.current.checked) daySelection.monday = true;
    if (tuesdayRef.current.checked) daySelection.tuesday = true;
    if (wednesdayRef.current.checked) daySelection.wednesday = true;
    if (thursdayRef.current.checked) daySelection.thursday = true;
    if (fridayRef.current.checked) daySelection.friday = true;

    const timeSlot = {
      days: daySelection,
      title: titleRef.current.value,
      startTime: startTimeRef.current.value,
      endTime: endTimeRef.current.value,
      location: locationRef.current.value || null,
      professor: professorRef.current.value || null,
      color: timeSlotColor,
    };

    fetch(`http://localhost:3001/api/schedules/63f2dbdeef9b9d56ba5fc264`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(timeSlot),
    })
      .then((res) => res.json())
      .then((data) => setTimeSlots((prevState) => [...prevState, data]))
      .catch((err) => console.log(err));
  };

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    action: string
  ) => {
    e.preventDefault();
    if (action === formActions.CREATE) addTimeSlot(e);
    formRef.current.reset();
  };

  return (
    <div className="mt-6 flex h-1/4 w-1/2 flex-col rounded-lg bg-slate-50 p-5 dark:bg-black sm:h-1/2">
      <form ref={formRef} onSubmit={(e) => handleSubmit(e, formActions.CREATE)}>
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Title
          </label>
          <input
            ref={titleRef}
            type="text"
            id="title"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="BIO130"
            required
          />
        </div>
        <div>
          <label
            htmlFor="days"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Days
          </label>
          <ul className="w-full items-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:flex">
            <li className="w-full border-b border-gray-200 dark:border-gray-600 sm:border-b-0 sm:border-r">
              <div className="flex items-center pl-3">
                <input
                  ref={mondayRef}
                  id="vue-checkbox-list"
                  type="checkbox"
                  value="monday"
                  className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
                />
                <label
                  htmlFor="vue-checkbox-list"
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
                  id="react-checkbox-list"
                  type="checkbox"
                  value="tuesday"
                  className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
                />
                <label
                  htmlFor="react-checkbox-list"
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
                  id="angular-checkbox-list"
                  type="checkbox"
                  value="wednesday"
                  className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
                />
                <label
                  htmlFor="angular-checkbox-list"
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
                  id="laravel-checkbox-list"
                  type="checkbox"
                  value="thursday"
                  className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
                />
                <label
                  htmlFor="laravel-checkbox-list"
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
                  id="laravel-checkbox-list"
                  type="checkbox"
                  value="friday"
                  className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
                />
                <label
                  htmlFor="laravel-checkbox-list"
                  className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Fri
                </label>
              </div>
            </li>
          </ul>
        </div>
        <div className="flex gap-12">
          <div className="w-1/2">
            <label
              htmlFor="startTime"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Start Time
            </label>
            <input
              ref={startTimeRef}
              type="text"
              id="title"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="10:30 AM"
              required
            />
          </div>
          <div className="w-1/2">
            <label
              htmlFor="endTime"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              End Time
            </label>
            <input
              ref={endTimeRef}
              type="text"
              id="title"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="12:30 PM"
              required
            />
          </div>
        </div>
        <div className="flex gap-12">
          <div className="w-1/2">
            <label
              htmlFor="location"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Location
            </label>
            <input
              ref={locationRef}
              type="text"
              id="location"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Whitman Hall"
            />
          </div>
          <div className="w-1/2">
            <label
              htmlFor="professor"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Professor
            </label>
            <input
              ref={professorRef}
              type="text"
              id="professor"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Dr. Gerstl"
            />
          </div>
        </div>
        <div className="flex justify-center">
          <div className="grid grid-cols-7 grid-rows-2 gap-2 p-2">
            {colors.map((color) => (
              <div
                onClick={() => setTimeSlotColor(color)}
                key={color}
                className={`bg-${color}-400 h-10 w-10 cursor-pointer rounded-full p-1 text-white`}
              />
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-blue-400 px-8 py-3 text-lg font-semibold text-white dark:bg-slate-300 dark:text-black"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default TimeSlotInput;
