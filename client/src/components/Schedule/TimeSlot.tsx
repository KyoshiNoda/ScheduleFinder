import React from 'react';

type Props = {
  id: string;
  top: string;
  height: string;
  title: string;
  startTime: string;
  endTime: string;
  location: string | null;
  professor: string | null;
  color: string;
};

function TimeSlot(props: Props) {
  return (
    <div
      className={`absolute p-3 text-xs flex flex-col justify-start items-center gap-1 rounded-lg bg-${props.color}-400 w-full dark:text-black`}
      style={{ top: `${props.top}px`, height: `${props.height}px` }}
    >
      <h2 className='text-center font-bold'>{props.title}</h2>
      <span>{`${props.startTime} - ${props.endTime}`}</span>
    </div>
  );
}

export default TimeSlot;
