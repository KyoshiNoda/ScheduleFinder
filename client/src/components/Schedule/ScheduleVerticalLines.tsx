const ScheduleVerticalLines = () => {
  //TODO: removed weekends.
  const leftPositions = [1/5, 2/5, 3/5, 4/5, 5/5 ];

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
