import { useState, useRef } from 'react';
import { useGetScheduleQuery } from '../../redux/services/auth/authService';
import { useCreateTimeSlotMutation } from '../../redux/services/schedule/scheduleService';
import { TimeSlot as TimeSlotType } from '../../types';
type Props = {
  setTimeSlots: any;
};

const formActions = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
};

export const colors: string[] = [
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

  const [timeSlotColor, setTimeSlotColor] = useState<string>('border-none');
  const [daysError, setDaysError] = useState<boolean>(false);

  const [createTimeSlotMutation, { isError, isLoading }] =
    useCreateTimeSlotMutation();

  let scheduleID = '';
  const { data, isFetching } = useGetScheduleQuery('schedule', {
    pollingInterval: 900000,
  });
  if (!isFetching && data) {
    scheduleID = data[0]._id;
  }

  const addTimeSlot = async (e: React.FormEvent<HTMLFormElement>) => {
    // If no checkboxes have been selected, the form shouldn't be submitted.
    if (
      !(
        mondayRef.current.checked ||
        tuesdayRef.current.checked ||
        wednesdayRef.current.checked ||
        thursdayRef.current.checked ||
        fridayRef.current.checked
      )
    ) {
      setDaysError(true);
      return;
    }

    const daySelection = {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    };

    if (mondayRef.current.checked) {
      daySelection.monday = true;
      setDaysError(false);
    }
    if (tuesdayRef.current.checked) {
      daySelection.tuesday = true;
      setDaysError(false);
    }
    if (wednesdayRef.current.checked) {
      daySelection.wednesday = true;
      setDaysError(false);
    }
    if (thursdayRef.current.checked) {
      daySelection.thursday = true;
      setDaysError(false);
    }
    if (fridayRef.current.checked) {
      daySelection.friday = true;
      setDaysError(false);
    }

    const currentTimeSlot: TimeSlotType = {
      days: daySelection,
      title: titleRef.current.value,
      startTime: startTimeRef.current.value,
      endTime: endTimeRef.current.value,
      location: locationRef.current.value || null,
      professor: professorRef.current.value || null,
      color: timeSlotColor,
    };

    try {
      const result = await createTimeSlotMutation({
        scheduleId: scheduleID,
        timeSlot: currentTimeSlot,
      });
      if ('data' in result) {
        const { data } = result;
        setTimeSlots((prevState: any) => [...prevState, data]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    action: string
  ) => {
    e.preventDefault();
    if (action === formActions.CREATE) addTimeSlot(e);
    setTimeSlotColor('border-none');
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
          />
        </div>
        <div>
          <label
            htmlFor="days"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Days
          </label>
          <ul
            className={`w-full items-center rounded-lg border bg-white text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:flex ${
              daysError ? ' border-rose-400' : ''
            }`}
          >
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
          <div className="flex w-full justify-center">
            {' '}
            {daysError && <p className="text-rose-500">Please pick a day!</p>}
          </div>
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
                className={`bg-${color}-400 h-10 w-10 cursor-pointer rounded-full border-4 p-1 ${
                  timeSlotColor === color ? 'border-blue-700' : 'border-none'
                }`}
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
