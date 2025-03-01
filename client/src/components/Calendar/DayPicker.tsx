import { useRef } from 'react';
import { DaysChecked } from '../../types';
interface DayPickerProps {
  selectedDays: DaysChecked;
  setSelectedDays: (selectedDays: DaysChecked) => void;
  daysError?: boolean;
}
const DayPicker = ({ selectedDays, setSelectedDays, daysError }: DayPickerProps): JSX.Element => {
  const mondayRef = useRef(document.createElement('input'));
  const tuesdayRef = useRef(document.createElement('input'));
  const wednesdayRef = useRef(document.createElement('input'));
  const thursdayRef = useRef(document.createElement('input'));
  const fridayRef = useRef(document.createElement('input'));

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, day: string) => {
    const updatedSelectedDays = { ...selectedDays };
    updatedSelectedDays[day] = e.target.checked;
    setSelectedDays(updatedSelectedDays);
  };

  return (
    <>
      <ul
        className={`w-full items-center rounded-lg border bg-white text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:flex ${
          daysError ? ' border-rose-400 dark:border-rose-400' : ''
        }`}
      >
        <li className="w-full border-b border-gray-200 dark:border-gray-600 sm:border-b-0 sm:border-r">
          <div className="flex items-center pl-3">
            <input
              ref={mondayRef}
              id="monday"
              type="checkbox"
              value="monday"
              checked={selectedDays.monday}
              onChange={(e) => handleCheckboxChange(e, "monday")}
              className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
            />
            <label htmlFor="monday" className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300">
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
              checked={selectedDays.tuesday}
              onChange={(e) => handleCheckboxChange(e, "tuesday")}
              className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
            />
            <label htmlFor="tuesday" className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300">
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
              checked={selectedDays.wednesday}
              onChange={(e) => handleCheckboxChange(e, "wednesday")}
              className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
            />
            <label htmlFor="wednesday" className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Wed
            </label>
          </div>
        </li>
        <li className="w-full border-b border-gray-200 dark:border-gray-600 sm:border-b-0 sm:border-r">
          <div className="flex items-center pl-3">
            <input
              ref={thursdayRef}
              id="thursday"
              type="checkbox"
              value="thursday"
              checked={selectedDays.thursday}
              onChange={(e) => handleCheckboxChange(e, "thursday")}
              className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
            />
            <label htmlFor="thursday" className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300">
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
              checked={selectedDays.friday}
              onChange={(e) => handleCheckboxChange(e, "friday")}
              className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
            />
            <label htmlFor="friday" className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Fri
            </label>
          </div>
        </li>
      </ul>
    </>
  );
};

export default DayPicker;
