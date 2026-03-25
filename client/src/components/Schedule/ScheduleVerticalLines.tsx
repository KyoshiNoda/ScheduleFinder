type Props = {
  dayCount: number;
  scheduleHeight: number;
  timeColumnWidth: number;
};

const ScheduleVerticalLines = ({ dayCount, scheduleHeight, timeColumnWidth }: Props) => {
  return (
    <>
      {Array.from({ length: dayCount }, (_, index) => index + 1).map((lineIndex) => (
        <hr
          key={lineIndex}
          className="pointer-events-none absolute top-0 border-l border-dotted border-gray-400 dark:border-gray-300"
          style={{
            left: `calc(${timeColumnWidth}px + ${lineIndex} * ((100% - ${timeColumnWidth}px) / ${dayCount}))`,
            height: `${scheduleHeight}px`,
          }}
        />
      ))}
    </>
  );
};

export default ScheduleVerticalLines;
