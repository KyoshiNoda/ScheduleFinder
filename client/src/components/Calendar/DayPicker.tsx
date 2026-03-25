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
  const dayOptions = [
    { key: 'monday', label: 'Mon', fullLabel: 'Monday', ref: mondayRef },
    { key: 'tuesday', label: 'Tue', fullLabel: 'Tuesday', ref: tuesdayRef },
    { key: 'wednesday', label: 'Wed', fullLabel: 'Wednesday', ref: wednesdayRef },
    { key: 'thursday', label: 'Thu', fullLabel: 'Thursday', ref: thursdayRef },
    { key: 'friday', label: 'Fri', fullLabel: 'Friday', ref: fridayRef },
  ] as const;

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, day: string) => {
    const updatedSelectedDays = { ...selectedDays };
    updatedSelectedDays[day] = e.target.checked;
    setSelectedDays(updatedSelectedDays);
  };

  return (
    <div
      className={`rounded-xl border p-2 transition-colors ${
        daysError
          ? 'border-rose-400 bg-rose-50/70 dark:border-rose-400 dark:bg-rose-950/20'
          : 'border-gray-200 bg-slate-50/70 dark:border-gray-600 dark:bg-gray-800/40'
      }`}
    >
      <ul className="grid grid-cols-5 gap-1 rounded-lg bg-white/80 p-1 dark:bg-slate-900/50">
        {dayOptions.map((day) => {
          const isSelected = selectedDays[day.key];

          return (
            <li key={day.key}>
              <label
                htmlFor={day.key}
                title={day.fullLabel}
                className={`flex min-h-[48px] cursor-pointer items-center justify-center rounded-md border px-1.5 text-[13px] font-semibold tracking-[0.01em] transition-all sm:text-sm ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm dark:border-blue-400 dark:bg-blue-500/10 dark:text-blue-200'
                    : 'border-transparent bg-transparent text-gray-600 hover:border-gray-200 hover:bg-slate-50 hover:text-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-slate-800/70 dark:hover:text-white'
                }`}
              >
                <input
                  ref={day.ref}
                  id={day.key}
                  type="checkbox"
                  value={day.key}
                  checked={selectedDays[day.key]}
                  onChange={(e) => handleCheckboxChange(e, day.key)}
                  className="sr-only"
                />
                <span className="whitespace-nowrap">{day.label}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DayPicker;
