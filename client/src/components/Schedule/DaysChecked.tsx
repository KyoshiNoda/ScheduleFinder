import { useState, useEffect } from 'react';
import { DaysChecked as DaysCheckedType } from '../../types';
type Props = {
  setDays: (days: DaysCheckedType) => void;
};

function DaysChecked({ setDays }: Props) {
  const [mondayChecked, setMondayChecked] = useState(false);
  const [tuesdayChecked, setTuesdayChecked] = useState(false);
  const [wednesdayChecked, setWednesdayChecked] = useState(false);
  const [thursdayChecked, setThursdayChecked] = useState(false);
  const [fridayChecked, setFridayChecked] = useState(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    switch (name) {
      case 'monday':
        setMondayChecked(checked);
        break;
      case 'tuesday':
        setTuesdayChecked(checked);
        break;
      case 'wednesday':
        setWednesdayChecked(checked);
        break;
      case 'thursday':
        setThursdayChecked(checked);
        break;
      case 'friday':
        setFridayChecked(checked);
        break;
    }
  };

  useEffect(() => {
    const result: DaysCheckedType = {
      monday: mondayChecked,
      tuesday: tuesdayChecked,
      wednesday: wednesdayChecked,
      thursday: thursdayChecked,
      friday: fridayChecked,
    };
    setDays(result);
  }, [
    mondayChecked,
    tuesdayChecked,
    wednesdayChecked,
    thursdayChecked,
    fridayChecked,
  ]);

  return (
    <ul className="w-full items-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:flex">
      <li className="w-full border-b border-gray-200 dark:border-gray-600 sm:border-b-0 sm:border-r">
        <div className="flex items-center pl-3">
          <input
            onChange={handleCheckboxChange}
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
            onChange={handleCheckboxChange}
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
            onChange={handleCheckboxChange}
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
            onChange={handleCheckboxChange}
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
            onChange={handleCheckboxChange}
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
  );
}

export default DaysChecked;
