import { Fragment, useEffect, useMemo, useRef } from 'react';
import { WEEK_DAYS, CALENDAR_HOURS, TODAY } from '../../../utils/constants';
import { cn } from '../../../utils/functions';
import { format, isSameDay } from 'date-fns';
import { generateWeekDates } from '../../../utils/scheduleUtils';

type Props = {
  initialDisplayDate: Date;
};

const LIGHT_MODE_BORDER = 'border-gray-200';
const DARK_MODE_BORDER = 'dark:border-gray-700';
const DAY_COLUMN_MIN_WIDTH = 168;
const TIME_COLUMN_WIDTH = 72;
const HALF_HOUR_ROW_HEIGHT = 36;
const ROWS_PER_HOUR = 2;
const TOTAL_ROWS = CALENDAR_HOURS.length * ROWS_PER_HOUR;
const DEFAULT_SCROLL_TOP = 6 * ROWS_PER_HOUR * HALF_HOUR_ROW_HEIGHT;

const WeeklyView = ({ initialDisplayDate }: Props) => {
  const dates = useMemo(() => generateWeekDates(initialDisplayDate), [initialDisplayDate]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const minGridWidth = TIME_COLUMN_WIDTH + DAY_COLUMN_MIN_WIDTH * WEEK_DAYS.length;
  const weekGridTemplate = `${TIME_COLUMN_WIDTH}px repeat(${WEEK_DAYS.length}, minmax(${DAY_COLUMN_MIN_WIDTH}px, 1fr))`;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = DEFAULT_SCROLL_TOP;
    }
  }, []);

  return (
    <div ref={scrollRef} className="h-[750px] overflow-auto">
      <div
        className="min-w-max bg-white dark:bg-slate-900"
        style={{ minWidth: `${minGridWidth}px` }}
      >
        <div
          className={cn(
            'sticky top-0 z-20 grid border-b bg-white shadow-sm dark:bg-slate-900',
            LIGHT_MODE_BORDER,
            DARK_MODE_BORDER
          )}
          style={{ gridTemplateColumns: weekGridTemplate }}
        >
          <div className={cn('border-r bg-white dark:bg-slate-900', LIGHT_MODE_BORDER, DARK_MODE_BORDER)} />
          {dates.map((date, index) => (
            <div
              key={date.getTime()}
              className={cn(
                'flex h-16 items-center justify-center gap-2 border-r px-3 text-sm',
                LIGHT_MODE_BORDER,
                DARK_MODE_BORDER
              )}
            >
              <span
                className={cn('text-gray-500 dark:text-gray-300', {
                  'text-blue-700 dark:text-blue-300': isSameDay(date, TODAY),
                })}
              >
                {WEEK_DAYS[index]}
              </span>
              <span
                className={cn('font-semibold', {
                  'rounded-full bg-blue-700 px-2.5 py-1 text-white': isSameDay(date, TODAY),
                })}
              >
                {format(date, 'd')}
              </span>
            </div>
          ))}
        </div>

        <div
          className="grid"
          style={{
            gridTemplateColumns: weekGridTemplate,
          }}
        >
          {Array.from({ length: TOTAL_ROWS }).map((_, rowIndex) => (
            <Fragment key={rowIndex}>
              <div
                className={cn(
                  'sticky left-0 z-10 relative border-r bg-white px-3 text-right text-xs font-semibold text-gray-400 dark:bg-slate-900 dark:text-gray-300',
                  LIGHT_MODE_BORDER,
                  DARK_MODE_BORDER,
                  {
                    'border-t': rowIndex > 0,
                  }
                )}
                style={{
                  height: `${HALF_HOUR_ROW_HEIGHT}px`,
                  borderTopStyle:
                    rowIndex > 0
                      ? rowIndex % ROWS_PER_HOUR === 0
                        ? 'solid'
                        : 'dashed'
                      : undefined,
                }}
              >
                {rowIndex % ROWS_PER_HOUR === 0 ? (
                  <span
                    className={cn('absolute right-3 text-xs font-semibold', {
                      'top-2': rowIndex === 0,
                      'top-0 -translate-y-1/2': rowIndex > 0,
                    })}
                  >
                    {CALENDAR_HOURS[rowIndex / ROWS_PER_HOUR]}
                  </span>
                ) : null}
              </div>

              {dates.map((date, dayIndex) => (
                <div
                  key={`${date.toISOString()}-${rowIndex}`}
                  className={cn(
                    'bg-white dark:bg-slate-900',
                    {
                      'border-t': rowIndex > 0,
                      'border-r': true,
                      'border-l border-dashed': dayIndex > 0,
                    },
                    LIGHT_MODE_BORDER,
                    DARK_MODE_BORDER
                  )}
                  style={{
                    height: `${HALF_HOUR_ROW_HEIGHT}px`,
                    borderTopStyle:
                      rowIndex > 0
                        ? rowIndex % ROWS_PER_HOUR === 0
                          ? 'solid'
                          : 'dashed'
                        : undefined,
                  }}
                />
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyView;
