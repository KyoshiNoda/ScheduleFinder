const ScheduleVerticalLines = () => {
  const leftPositions = [1 / 7, 2 / 7, 3 / 7, 4 / 7, 5 / 7, 6 / 7, 7 / 7];

  return (
    <>
      {leftPositions.map((left, index) => (
        <hr
          key={index}
          className="absolute top-0 h-[1750px] border-l border-dotted border-gray-400 dark:border-gray-300"
          style={{ left: `${left * 100}%`, marginLeft: `${62}px` }}
        />
      ))}
    </>
  );
};

export default ScheduleVerticalLines;
