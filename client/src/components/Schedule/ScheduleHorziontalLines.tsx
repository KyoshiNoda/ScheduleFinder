const ScheduleHorizontalLines = () => {
  return (
    <div className="pointer-events-none absolute h-full w-full">
      {Array.from({ length: 24 }, (_, index) => (
        <div key={index} className="h-[72px] border-t border-gray-200 dark:border-gray-600"></div>
      ))}
    </div>
  );
};

export default ScheduleHorizontalLines;
