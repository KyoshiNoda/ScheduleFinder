import { Button } from 'flowbite-react';
import { useState } from 'react';
import { CalendarViewEnum } from '../../enums';

interface Props {}

const CalendarViewParent = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedView, setSelectedView] = useState<CalendarViewEnum>(CalendarViewEnum.WEEK);

  const handleViewSelection = (calendarView: CalendarViewEnum) => {
    setSelectedView(calendarView);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <div className="h-56 rounded-md border dark:border-slate-700">
        <header className="flex items-center justify-between border border-t-0 border-l-0 border-r-0 bg-gray-50 px-6 py-4 dark:border-slate-700 dark:bg-gray-800">
          <h1 className="text-md font-semibold">June 2024</h1>
          <div className="relative flex items-center gap-6">
            <Button.Group>
              <Button color="gray">
                <svg
                  className="h-[16px] w-[16px] text-gray-500 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m15 19-7-7 7-7"
                  />
                </svg>
              </Button>
              <Button color="gray">
                <svg
                  className="h-[16px] w-[16px] text-gray-500 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m9 5 7 7-7 7"
                  />
                </svg>
              </Button>
            </Button.Group>

            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="inline-flex items-center rounded-lg p-2 text-center text-sm font-medium text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              type="button"
            >
              <svg
                className="h-5 w-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 3"
              >
                <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute top-12 right-0 z-10 w-36 rounded-lg bg-white py-2 shadow dark:divide-gray-600 dark:bg-gray-700">
                <ul className="divide-y  divide-gray-100 text-sm text-gray-700 dark:text-gray-200 dark:divide-slate-600">
                  <li className="py-1">
                    <button className="w-full px-4 py-2 text-start text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">
                      Create event
                    </button>
                  </li>
                  <li className="py-1">
                    <button className="w-full px-4 py-2 text-start text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">
                      Go to today
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
        </header>
        <main>
          {selectedView === CalendarViewEnum.DAY && <h2>Day view</h2>}
          {selectedView === CalendarViewEnum.WEEK && <h2>Week view</h2>}
          {selectedView === CalendarViewEnum.MONTH && <h2>Month view</h2>}
          {selectedView === CalendarViewEnum.YEAR && <h2>Year view</h2>}
        </main>
      </div>
    </>
  );
};

export default CalendarViewParent;
