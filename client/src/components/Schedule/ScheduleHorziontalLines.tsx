type Props = {
  scheduleHeight: number;
  timeColumnWidth: number;
};

const HOUR_HEIGHT = 72;
const START_OFFSET = 52;

const ScheduleHorziontalLines = ({ scheduleHeight, timeColumnWidth }: Props) => {
  const lineCount = Math.floor((scheduleHeight - START_OFFSET) / HOUR_HEIGHT);

  return (
    <>
      {Array.from({ length: lineCount }, (_, index) => START_OFFSET + index * HOUR_HEIGHT).map(
        (top) => (
          <hr
            key={top}
            className="pointer-events-none absolute border-dotted bg-gray-400 dark:bg-gray-900"
            style={{
              left: `${timeColumnWidth}px`,
              top: `${top}px`,
              width: `calc(100% - ${timeColumnWidth}px)`,
            }}
          />
        )
      )}
    </>
  );
};

export default ScheduleHorziontalLines;
