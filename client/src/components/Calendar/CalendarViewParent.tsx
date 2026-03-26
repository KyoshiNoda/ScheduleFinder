import { Button } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { CalendarViewEnum } from '../../enums';
import { capitalizeWord } from '../../utils/functions';
import { FaAngleDown, FaAngleLeft, FaAngleRight, FaTimes } from 'react-icons/fa';
import WeeklyView from './Views/WeeklyView';
import { addDays, subDays, addMonths, subMonths, addYears, subYears, format } from 'date-fns';
import MonthlyView from './Views/MonthlyView';
import { TODAY } from '../../utils/constants';
import TimeSlotInput from '../TimeSlot/TimeSlotInput';
import ClearScheduleButton from '../Schedule/ClearScheduleButton';
import { useGetScheduleQuery } from '../../redux/services/schedule/scheduleService';

const CalendarViewParent = () => {
  const [selectedView, setSelectedView] = useState<string>(
    localStorage.getItem('calendarView') || CalendarViewEnum.WEEK
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isEventPanelOpen, setIsEventPanelOpen] = useState<boolean>(false);
  const [initialDisplayDate, setInitialDisplayDate] = useState(TODAY);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: scheduleData } = useGetScheduleQuery('schedule', {
    pollingInterval: 900000,
  });

  const scheduleId = scheduleData?._id ?? '';

  useEffect(() => {
    if (!isDropdownOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    if (!isEventPanelOpen) {
      return;
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsEventPanelOpen(false);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isEventPanelOpen]);

  const handleViewSelection = (calendarView: CalendarViewEnum) => {
    localStorage.setItem('calendarView', calendarView);
    setSelectedView(calendarView);
    setIsDropdownOpen(false);
  };

  const leftArrowClickHandler = () => {
    switch (selectedView) {
      case CalendarViewEnum.DAY:
        setInitialDisplayDate(subDays(initialDisplayDate, 1));
        break;
      case CalendarViewEnum.WEEK:
        setInitialDisplayDate(subDays(initialDisplayDate, 7));
        break;
      case CalendarViewEnum.MONTH:
        setInitialDisplayDate(subMonths(initialDisplayDate, 1));
        break;
      case CalendarViewEnum.YEAR:
        setInitialDisplayDate(subYears(initialDisplayDate, 1));
        break;
      default:
        break;
    }
  };

  const rightArrowClickHandler = () => {
    switch (selectedView) {
      case CalendarViewEnum.DAY:
        setInitialDisplayDate(addDays(initialDisplayDate, 1));
        break;
      case CalendarViewEnum.WEEK:
        setInitialDisplayDate(addDays(initialDisplayDate, 7));
        break;
      case CalendarViewEnum.MONTH:
        setInitialDisplayDate(addMonths(initialDisplayDate, 1));
        break;
      case CalendarViewEnum.YEAR:
        setInitialDisplayDate(addYears(initialDisplayDate, 1));
        break;
      default:
        break;
    }
  };

  const horizontalDotsSVG = (
    <svg
      className="h-5 w-5"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 16 3"
    >
      <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
    </svg>
  );

  const renderView = () => {
    switch (selectedView) {
      case CalendarViewEnum.DAY:
        return 'Daily view';
      case CalendarViewEnum.WEEK:
        return <WeeklyView initialDisplayDate={initialDisplayDate} />;
      case CalendarViewEnum.MONTH:
        return <MonthlyView initialDisplayDate={initialDisplayDate} />;
      case CalendarViewEnum.YEAR:
        return 'Yearly view';
    }
  };

  const resetToToday = () => {
    setInitialDisplayDate(TODAY);
    setIsDropdownOpen(false);
  };

  const openEventPanel = () => {
    setIsDropdownOpen(false);
    setIsEventPanelOpen(true);
  };

  return (
    <>
      <div className="overflow-visible rounded-md border bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <header className="flex flex-col gap-4 border border-t-0 border-l-0 border-r-0 bg-gray-50 px-6 py-4 dark:border-slate-700 dark:bg-gray-800 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="text-md font-semibold">{format(initialDisplayDate, 'MMMM yyyy')}</h1>
          <div className="flex flex-wrap items-center gap-3 md:gap-6">
            <Button.Group>
              <Button color="gray" onClick={leftArrowClickHandler}>
                <FaAngleLeft className="h-4" />
              </Button>
              <Button color="gray" size="sm" className="hidden md:block">
                <span className="px-3" onClick={resetToToday}>
                  Today
                </span>
              </Button>
              <Button color="gray" onClick={rightArrowClickHandler}>
                <FaAngleRight className="h-4" />
              </Button>
            </Button.Group>

            <div className="relative" ref={dropdownRef}>
              <Button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="hidden md:block"
                color="gray"
                size="sm"
              >
                {capitalizeWord(selectedView)} view
                <FaAngleDown className="ml-2 text-gray-500" />
              </Button>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="inline-flex items-center rounded-lg p-2 text-center text-sm font-medium text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
                type="button"
              >
                {horizontalDotsSVG}
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 top-12 z-50 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-slate-600 dark:bg-gray-700">
                  <ul className="text-sm text-gray-700 dark:divide-slate-600 dark:text-gray-200">
                    <li className="py-1 md:hidden">
                      <button
                        onClick={openEventPanel}
                        className="w-full border-b border-b-gray-100 px-4 py-2 text-start text-sm text-gray-700 hover:bg-gray-100 dark:border-b-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Create event
                      </button>
                    </li>
                    <li className="py-1 md:hidden">
                      <button
                        onClick={resetToToday}
                        className="w-full border-b border-b-gray-100 px-4 py-2 text-start text-sm text-gray-700 hover:bg-gray-100 dark:border-b-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Today
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleViewSelection(CalendarViewEnum.DAY)}
                        className="w-full px-4 py-2 text-start hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Day view
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleViewSelection(CalendarViewEnum.WEEK)}
                        className="w-full px-4 py-2 text-start hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Week view
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleViewSelection(CalendarViewEnum.MONTH)}
                        className="w-full px-4 py-2 text-start hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Month view
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleViewSelection(CalendarViewEnum.YEAR)}
                        className="w-full px-4 py-2 text-start hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Year view
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <ClearScheduleButton
              scheduleId={scheduleId}
              currentSchedule={scheduleData}
              className="hidden md:inline-flex"
            />
            <Button size="sm" className="hidden md:block" onClick={openEventPanel}>
              Add event
            </Button>
          </div>
        </header>
        <main>{renderView()}</main>
      </div>
      {isEventPanelOpen && (
        <div
          className="fixed inset-0 z-[60] flex justify-end bg-slate-950/35 p-4 backdrop-blur-[2px] md:p-6"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsEventPanelOpen(false);
            }
          }}
        >
          <div className="flex h-full w-full max-w-[460px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700">
              <div>
                <h2 className="text-lg font-semibold">Add event</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Create a new week-view timeslot from this panel.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEventPanelOpen(false)}
                className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                aria-label="Close add event panel"
              >
                <FaTimes className="h-4 w-4" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
              <TimeSlotInput showClearButton={false} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CalendarViewParent;
