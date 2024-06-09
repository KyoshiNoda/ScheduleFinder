const ScheduleVerticalLines = () => {
  const leftPositions = [1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6, 6 / 6]; 

  return (
    <>
      {leftPositions.map((left, index) => (
        <hr
          key={index}
          className="absolute top-0 h-[1750px] border-l border-dotted border-gray-400 dark:border-gray-300"
          style={{ left: `${left * 100}%`, marginLeft: `${25}px` }}
        />
      ))}
    </>
  );
};

export default ScheduleVerticalLines;
