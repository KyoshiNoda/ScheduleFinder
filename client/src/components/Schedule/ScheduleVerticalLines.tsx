const ScheduleVerticalLines = () => {
  return (
    <div className="pointer-events-none absolute h-full w-full">
      {Array.from({ length: 7 }, (_, index) => (
        <div
          key={index}
          className="absolute top-0 left-[calc(100%/7*${index})] h-full w-px bg-gray-200 dark:bg-gray-600"
        ></div>
      ))}
    </div>
  );
};

export default ScheduleVerticalLines;
